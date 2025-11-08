from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.recording import RecordingStatus


class RecordingBase(BaseModel):
    student_id: str = Field(..., description="ID do estudante")
    story_id: str = Field(..., description="ID da história")
    duration_seconds: float = Field(..., ge=0, description="Duração em segundos")
    transcription: Optional[str] = Field(None, description="Transcrição do áudio")


class RecordingCreate(RecordingBase):
    pass


class RecordingUpdate(BaseModel):
    transcription: Optional[str] = None
    status: Optional[RecordingStatus] = None
    audio_file_path: Optional[str] = None
    audio_url: Optional[str] = None


class RecordingAnalysisResponse(BaseModel):
    id: str
    recording_id: str
    fluency_score: Optional[float] = None
    prosody_score: Optional[float] = None
    speed_wpm: Optional[float] = None
    accuracy_score: Optional[float] = None
    overall_score: Optional[float] = None
    errors_detected: Optional[dict] = None
    pauses_analysis: Optional[dict] = None
    ai_feedback: Optional[str] = None
    ai_recommendations: Optional[dict] = None
    processed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class RecordingResponse(BaseModel):
    id: str
    student_id: str
    story_id: str
    audio_file_path: Optional[str]
    audio_url: Optional[str]
    duration_seconds: float
    recorded_at: datetime
    transcription: Optional[str]
    status: RecordingStatus
    created_by: Optional[str]
    updated_by: Optional[str]
    updated_at: Optional[datetime]
    analysis: Optional[RecordingAnalysisResponse] = None

    class Config:
        from_attributes = True


class RecordingListResponse(BaseModel):
    recordings: list[RecordingResponse]
    total: int

