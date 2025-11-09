from datetime import datetime
from typing import Optional, List, Any

from pydantic import BaseModel, Field

from app.models.diagnostic import DiagnosticType


class DiagnosticBase(BaseModel):
    student_id: str = Field(..., description="ID do estudante")
    conducted_by: str = Field(..., description="ID do profissional que realizou o diagnóstico")
    diagnostic_type: DiagnosticType
    overall_score: Optional[float] = Field(
        None, ge=0, le=100, description="Pontuação geral do diagnóstico (0-100)"
    )
    reading_level: Optional[str] = Field(
        None, description="Nível de leitura avaliado"
    )
    strengths: Optional[List[Any]] = Field(
        default=None, description="Lista de pontos fortes identificados"
    )
    difficulties: Optional[List[Any]] = Field(
        default=None, description="Lista de dificuldades identificadas"
    )
    recommendations: Optional[str] = Field(
        default=None, description="Recomendações do profissional"
    )
    ai_insights: Optional[List[Any]] = Field(
        default=None, description="Insights gerados pela IA"
    )


class DiagnosticCreate(DiagnosticBase):
    pass


class DiagnosticUpdate(BaseModel):
    diagnostic_type: Optional[DiagnosticType] = None
    overall_score: Optional[float] = Field(None, ge=0, le=100)
    reading_level: Optional[str] = None
    strengths: Optional[List[Any]] = None
    difficulties: Optional[List[Any]] = None
    recommendations: Optional[str] = None
    ai_insights: Optional[List[Any]] = None


class DiagnosticResponse(BaseModel):
    id: str
    student_id: str
    conducted_by: str
    diagnostic_type: DiagnosticType
    overall_score: Optional[float]
    reading_level: Optional[str]
    strengths: Optional[List[Any]]
    difficulties: Optional[List[Any]]
    recommendations: Optional[str]
    ai_insights: Optional[List[Any]]
    created_at: datetime

    class Config:
        from_attributes = True


class DiagnosticListResponse(BaseModel):
    diagnostics: List[DiagnosticResponse]
    total: int

