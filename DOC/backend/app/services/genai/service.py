import json
import re
import uuid
from typing import Dict, List, Optional, Any

from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ai_insight import InsightPriority, InsightType
from app.models.diagnostic import Diagnostic
from app.models.recording import Recording, RecordingAnalysis
from app.models.student import Student
from app.services.genai.client import get_genai_client, get_genai_model_config


class GeminiServiceError(RuntimeError):
    pass


class GeminiService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.client = get_genai_client()
        self.model_config = get_genai_model_config()

    async def _fetch_student(self, student_id: uuid.UUID) -> Optional[Student]:
        result = await self.session.execute(
            select(Student).where(Student.id == student_id)
        )
        return result.scalar_one_or_none()

    async def _fetch_recent_recordings(
        self, student_id: uuid.UUID, limit: int = 5
    ) -> List[Recording]:
        stmt = (
            select(Recording)
            .options(
                selectinload(Recording.story),
                selectinload(Recording.analysis),
            )
            .where(
                Recording.student_id == student_id,
                Recording.transcription.isnot(None),
            )
            .order_by(Recording.recorded_at.desc())
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def _fetch_recent_diagnostics(
        self, student_id: uuid.UUID, limit: int = 3
    ) -> List[Diagnostic]:
        result = await self.session.execute(
            select(Diagnostic)
            .where(Diagnostic.student_id == student_id)
            .order_by(Diagnostic.created_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

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
                strengths = ", ".join(map(str, diagnostic.strengths))
                parts.append(f"Pontos fortes: {strengths}")
            if diagnostic.difficulties:
                difficulties = ", ".join(map(str, diagnostic.difficulties))
                parts.append(f"Dificuldades: {difficulties}")
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
        correct = pauses_info.get("correct_words")
        total_words = pauses_info.get("total_words")
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

    async def generate_student_feedback(
        self,
        student_id: str,
        question: str,
        model: Optional[str] = None,
    ) -> str:
        try:
            student_uuid = uuid.UUID(student_id)
        except ValueError as exc:
            raise GeminiServiceError("Identificador de estudante inválido") from exc

        student = await self._fetch_student(student_uuid)
        if not student:
            raise GeminiServiceError("Estudante não encontrado")

        recordings = await self._fetch_recent_recordings(student_uuid)
        diagnostics = await self._fetch_recent_diagnostics(student_uuid)

        context_sections = []
        if student.observations:
            context_sections.append(
                f"Observações do professor:\n{student.observations.strip()}"
            )

        diagnostics_text = self._format_diagnostics(diagnostics)
        if diagnostics_text:
            context_sections.append(f"Diagnósticos recentes:\n{diagnostics_text}")

        recordings_text = self._format_recordings(recordings)
        if recordings_text:
            context_sections.append(f"Transcrições de leituras:\n{recordings_text}")

        context = "\n\n".join(context_sections) if context_sections else "Sem contexto adicional."

        prompt = (
            "Você é um assistente pedagógico especializado em alfabetização. "
            "Use o contexto fornecido para responder de forma objetiva, em português do Brasil.\n\n"
            f"Dados do estudante: {student.name} (idade: {student.age or 'não informada'})\n"
            f"Contexto disponível:\n{context}\n\n"
            f"Pergunta: {question}\n\n"
            "Resposta:"
        )

        config = self.model_config.copy()
        model_id = model or config.pop("model", "models/gemini-2.5-flash")
        if not model_id.startswith("models/"):
            model_id = f"models/{model_id}"

        try:
            response = self.client.models.generate_content(
                model=model_id,
                contents=prompt,
                **config,
            )
        except Exception as exc:  # noqa: BLE001
            raise GeminiServiceError("Falha ao gerar conteúdo com o Gemini") from exc

        answer = getattr(response, "text", None)
        if not answer:
            raise GeminiServiceError("Resposta vazia recebida do Gemini")
        return answer.strip()

    def _extract_json_payload(self, raw_text: str) -> Optional[dict]:
        content = raw_text.strip()
        if "```" in content:
            match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", content, re.DOTALL)
            if match:
                content = match.group(1)
        try:
            data = json.loads(content)
        except json.JSONDecodeError:
            return None
        if not isinstance(data, dict):
            return None
        return data

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

        return {
            "type": insight_type,
            "priority": priority,
            "title": title,
            "description": description,
        }

    async def generate_recording_insight(self, recording: Recording) -> Optional[dict]:
        if not recording.transcription:
            return None

        student = await self._fetch_student(recording.student_id)
        if not student:
            return None

        diagnostics = await self._fetch_recent_diagnostics(recording.student_id)
        previous_recordings = await self._fetch_recent_recordings(recording.student_id)
        diagnostics_text = self._format_diagnostics(diagnostics)
        recordings_text = self._format_recordings(previous_recordings)
        current_analysis_text = self._format_metrics(recording.analysis)

        context_sections = []
        if student.observations:
            context_sections.append(f"Observações do professor:\n{student.observations.strip()}")
        if diagnostics_text:
            context_sections.append(f"Diagnósticos recentes:\n{diagnostics_text}")
        if recordings_text:
            context_sections.append(f"Leituras anteriores:\n{recordings_text}")

        if current_analysis_text:
            context_sections.append(f"Métricas da leitura atual:\n{current_analysis_text}")

        context_summary = "\n\n".join(context_sections) if context_sections else "Sem contexto adicional."

        new_recording_block = (
            f"Nova gravação:\n"
            f"- História ID: {recording.story_id}\n"
            f"- Data/hora: {recording.recorded_at}\n"
            f"- Duração: {recording.duration_seconds:.1f} segundos\n"
            f"- Transcrição completa:\n{recording.transcription.strip()}\n"
        )

        prompt = (
            "Você é um especialista em alfabetização auxiliando um profissional da educação. "
            "Avalie a nova gravação do aluno com base no contexto e produza um insight pedagógico útil. "
            "Mantenha um tom encorajador e prático.\n\n"
            f"Aluno: {student.name} (idade: {student.age or 'não informada'})\n"
            f"{new_recording_block}\n"
            f"Contexto adicional:\n{context_summary}\n\n"
            "Responda exclusivamente em JSON com os campos obrigatórios:\n"
            '{"type": "progress|attention_needed|suggestion", '
            '"priority": "low|medium|high", '
            '"title": "frase curta", "description": "parágrafo breve com orientação prática"}\n'
            "Não inclua texto fora do JSON."
        )

        config = self.model_config.copy()
        model_id = config.pop("model", "models/gemini-2.5-flash")
        if not model_id.startswith("models/"):
            model_id = f"models/{model_id}"

        try:
            response = self.client.models.generate_content(
                model=model_id,
                contents=prompt,
                **config,
            )
        except Exception as exc:  # noqa: BLE001
            raise GeminiServiceError("Falha ao gerar insight com o Gemini") from exc

        answer = getattr(response, "text", None)
        if not answer:
            return None

        payload = self._extract_json_payload(answer)
        if not payload:
            return None

        return self._normalize_insight_payload(payload)

