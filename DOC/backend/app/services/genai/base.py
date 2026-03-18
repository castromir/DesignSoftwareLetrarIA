import json
import logging
import re
import uuid
from abc import ABC, abstractmethod
from typing import Dict, List, Optional, Any

logger = logging.getLogger(__name__)

from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ai_insight import InsightPriority, InsightType
from app.models.diagnostic import Diagnostic
from app.models.recording import Recording, RecordingAnalysis
from app.models.student import Student
from app.services.genai.system_prompt import READING_EVALUATOR_PROMPT


class AIServiceError(RuntimeError):
    pass


class BaseAIService(ABC):
    """Base class para todos os providers de IA. Contém lógica de busca de dados,
    formatação de prompts e parsing de resposta. Subclasses implementam apenas _call_model."""

    def __init__(self, session: AsyncSession):
        self.session = session

    # ------------------------------------------------------------------ #
    # Busca de dados                                                       #
    # ------------------------------------------------------------------ #

    async def _fetch_student(self, student_id: uuid.UUID) -> Optional[Student]:
        result = await self.session.execute(
            select(Student).where(Student.id == student_id)
        )
        return result.scalar_one_or_none()

    async def _fetch_all_recordings(
        self,
        student_id: uuid.UUID,
        exclude_id: Optional[uuid.UUID] = None,
        limit: int = 5,
    ) -> List[Recording]:
        conditions = [
            Recording.student_id == student_id,
            Recording.transcription.isnot(None),
        ]
        if exclude_id is not None:
            conditions.append(Recording.id != exclude_id)
        stmt = (
            select(Recording)
            .options(
                selectinload(Recording.story),
                selectinload(Recording.analysis),
            )
            .where(*conditions)
            .order_by(Recording.recorded_at.asc())
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def _fetch_all_diagnostics(
        self, student_id: uuid.UUID, limit: int = 3
    ) -> List[Diagnostic]:
        result = await self.session.execute(
            select(Diagnostic)
            .where(Diagnostic.student_id == student_id)
            .order_by(Diagnostic.created_at.asc())
            .limit(limit)
        )
        return list(result.scalars().all())

    # ------------------------------------------------------------------ #
    # Formatação                                                           #
    # ------------------------------------------------------------------ #

    def _format_recordings(self, recordings: List[Recording]) -> str:
        if not recordings:
            return ""
        entries = []
        for recording in recordings:
            title = recording.story.title if recording.story else "Leitura"
            transcript = recording.transcription or ""
            metrics_block = self._format_metrics(recording.analysis)
            entries.append(
                f"Título: {title}\nData: {recording.recorded_at}\n"
                f"Dados técnicos:\n{metrics_block}\n"
                f"Transcrição:\n{transcript.strip()}"
            )
        return "\n\n".join(entries)

    def _format_diagnostics(self, diagnostics: List[Diagnostic]) -> str:
        if not diagnostics:
            return ""
        entries = []
        for diagnostic in diagnostics:
            parts = [
                f"Tipo: {diagnostic.diagnostic_type.value}",
                f"Data: {diagnostic.created_at}",
            ]
            if diagnostic.overall_score is not None:
                parts.append(f"Pontuação: {diagnostic.overall_score}")
            if diagnostic.reading_level:
                parts.append(f"Nível de leitura: {diagnostic.reading_level}")
            if diagnostic.strengths:
                parts.append(f"Pontos fortes: {', '.join(map(str, diagnostic.strengths))}")
            if diagnostic.difficulties:
                parts.append(f"Dificuldades: {', '.join(map(str, diagnostic.difficulties))}")
            if diagnostic.recommendations:
                parts.append(f"Recomendações: {diagnostic.recommendations.strip()}")
            entries.append("\n".join(parts))
        return "\n\n".join(entries)

    def _format_metrics(self, analysis: Optional[RecordingAnalysis]) -> str:
        if not analysis:
            return "Sem métricas disponíveis"
        details: List[str] = []
        if analysis.accuracy_score is not None:
            details.append(f"Acurácia: {analysis.accuracy_score:.1f}%")
        if analysis.errors_detected:
            details.append(f"Erros detectados: {len(analysis.errors_detected)}")
        pauses_info = analysis.pauses_analysis or {}
        total_words = pauses_info.get("total_words")
        correct = pauses_info.get("correct_words")
        if total_words is not None:
            details.append(f"Palavras totais: {total_words}")
        if correct is not None:
            details.append(f"Palavras corretas: {correct}")
        if analysis.speed_wpm is not None:
            details.append(f"Palavras por minuto: {analysis.speed_wpm:.1f}")
        if analysis.fluency_score is not None:
            details.append(f"Fluência: {analysis.fluency_score:.1f}")
        if analysis.prosody_score is not None:
            details.append(f"Prosódia: {analysis.prosody_score:.1f}")
        improvements = pauses_info.get("improvement_points")
        if isinstance(improvements, list) and improvements:
            details.append("Pontos de melhoria: " + ", ".join(improvements[:3]))
        return "\n".join(details) if details else "Sem métricas disponíveis"

    # ------------------------------------------------------------------ #
    # Parsing de resposta                                                  #
    # ------------------------------------------------------------------ #

    def _extract_json_payload(self, raw_text: str) -> Optional[dict]:
        content = raw_text.strip()

        # Remove blocos de código markdown se presentes
        if "```" in content:
            match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", content, re.DOTALL)
            if match:
                content = match.group(1)

        # Tenta parse direto
        try:
            data = json.loads(content)
            return data if isinstance(data, dict) else None
        except json.JSONDecodeError:
            pass

        # Extrai o bloco { ... } mais externo da resposta (modelo pode adicionar texto antes/depois)
        match = re.search(r"\{.*\}", content, re.DOTALL)
        if match:
            candidate = match.group(0)
            # Normaliza quebras de linha literais dentro de strings JSON (modelo pode gerar \n real)
            # Substitui quebras de linha por \n escapado apenas dentro de valores de string
            candidate = re.sub(
                r'("(?:[^"\\]|\\.)*")',
                lambda m: m.group(0).replace("\n", "\\n").replace("\r", ""),
                candidate,
            )
            try:
                data = json.loads(candidate)
                return data if isinstance(data, dict) else None
            except json.JSONDecodeError:
                pass

        logger.warning("[base] Falha ao extrair JSON. Prévia da resposta: %.300s", raw_text)
        return None

    def _normalize_insight_payload(self, payload: dict) -> Optional[dict]:
        raw_type = str(payload.get("type", "suggestion")).strip()
        raw_priority = str(payload.get("priority", "medium")).strip()
        title = str(payload.get("title", "")).strip()
        description = str(payload.get("description", "")).strip()
        if not title or not description:
            return None
        try:
            insight_type = InsightType(raw_type)
        except ValueError:
            insight_type = InsightType.suggestion
        try:
            priority = InsightPriority(raw_priority)
        except ValueError:
            priority = InsightPriority.medium

        prosody_score: Optional[float] = None
        raw_prosody = payload.get("prosody_score")
        if raw_prosody is not None:
            try:
                prosody_score = max(0.0, min(100.0, float(raw_prosody)))
            except (TypeError, ValueError):
                prosody_score = None

        return {
            "type": insight_type,
            "priority": priority,
            "title": title,
            "description": description,
            "prosody_score": prosody_score,
        }

    # ------------------------------------------------------------------ #
    # Interface abstrata — providers implementam este método               #
    # ------------------------------------------------------------------ #

    @abstractmethod
    async def _call_model(self, prompt: str) -> str:
        """Envia o prompt ao modelo e retorna a resposta em texto plano."""

    # ------------------------------------------------------------------ #
    # Métodos públicos (compartilhados por todos os providers)             #
    # ------------------------------------------------------------------ #

    async def generate_student_feedback(
        self,
        student_id: str,
        question: str,
        model: Optional[str] = None,
    ) -> str:
        try:
            student_uuid = uuid.UUID(student_id)
        except ValueError as exc:
            raise AIServiceError("Identificador de estudante inválido") from exc

        student = await self._fetch_student(student_uuid)
        if not student:
            raise AIServiceError("Estudante não encontrado")

        recordings = await self._fetch_all_recordings(student_uuid)
        diagnostics = await self._fetch_all_diagnostics(student_uuid)

        context_sections = []
        if student.observations:
            context_sections.append(f"Observações do professor:\n{student.observations.strip()}")
        diagnostics_text = self._format_diagnostics(diagnostics)
        if diagnostics_text:
            context_sections.append(f"Diagnósticos recentes:\n{diagnostics_text}")
        recordings_text = self._format_recordings(recordings)
        if recordings_text:
            context_sections.append(f"Transcrições de leituras:\n{recordings_text}")
        context = "\n\n".join(context_sections) if context_sections else "Sem contexto adicional."

        data_section = (
            f"Aluno: {student.name} (idade: {student.age or 'não informada'})\n\n"
            f"Contexto disponível:\n{context}\n\n"
            f"Pergunta do professor: {question}\n\n"
            "Responda de forma objetiva e prática, em português do Brasil. "
            "Não responda em JSON — responda em texto corrido."
        )

        prompt = f"{READING_EVALUATOR_PROMPT}\n\n---\n\n{data_section}"

        try:
            answer = await self._call_model(prompt)
        except AIServiceError:
            raise
        except Exception as exc:
            raise AIServiceError("Falha ao gerar feedback") from exc

        if not answer:
            raise AIServiceError("Resposta vazia recebida do modelo")
        return answer.strip()

    async def generate_recording_insight(self, recording: Recording) -> Optional[dict]:
        if not recording.transcription:
            return None

        student = await self._fetch_student(recording.student_id)
        if not student:
            return None

        diagnostics = await self._fetch_all_diagnostics(recording.student_id)
        previous_recordings = await self._fetch_all_recordings(
            recording.student_id, exclude_id=recording.id
        )
        diagnostics_text = self._format_diagnostics(diagnostics)
        recordings_text = self._format_recordings(previous_recordings)
        current_analysis_text = self._format_metrics(recording.analysis)

        context_sections = []
        if student.age:
            context_sections.append(f"Idade do aluno: {student.age} anos")
        if student.observations:
            context_sections.append(f"Observações do professor:\n{student.observations.strip()}")
        if diagnostics_text:
            context_sections.append(f"Diagnósticos (todos, ordem cronológica):\n{diagnostics_text}")
        if recordings_text:
            context_sections.append(
                f"Histórico completo de leituras anteriores ({len(previous_recordings)} gravação(ões), ordem cronológica):\n{recordings_text}"
            )
        if current_analysis_text:
            context_sections.append(f"Métricas da leitura atual:\n{current_analysis_text}")
        context_summary = "\n\n".join(context_sections) if context_sections else "Sem contexto adicional."

        story_ref = ""
        if recording.story and recording.story.content:
            story_ref = f"\nTexto de referência lido:\n{recording.story.content.strip()}\n"

        data_section = (
            f"Aluno: {student.name} (idade: {student.age or 'não informada'})\n\n"
            f"Leitura atual:\n"
            f"- Título: {recording.story.title if recording.story else 'Desconhecido'}\n"
            f"- Data/hora: {recording.recorded_at}\n"
            f"- Duração: {recording.duration_seconds:.1f} segundos\n"
            f"{story_ref}"
            f"- Transcrição do aluno:\n{recording.transcription.strip()}\n\n"
            f"Contexto do aluno:\n{context_summary}"
        )

        prompt = f"{READING_EVALUATOR_PROMPT}\n\n---\n\n{data_section}"

        try:
            answer = await self._call_model(prompt)
        except Exception:
            logger.exception("Falha ao chamar o modelo de IA para generate_recording_insight")
            return None

        if not answer:
            logger.warning("Modelo de IA retornou resposta vazia para generate_recording_insight")
            return None

        payload = self._extract_json_payload(answer)
        if not payload:
            logger.warning("Não foi possível extrair JSON da resposta do modelo: %.500s", answer)
            return None
        return self._normalize_insight_payload(payload)
