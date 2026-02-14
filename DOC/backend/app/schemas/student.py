from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import date, datetime
from app.models.student import StudentStatus, Gender


class StudentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    registration: Optional[str] = Field(None, max_length=50)
    gender: Optional[Gender] = None
    birth_date: Optional[date] = None
    age: Optional[int] = Field(None, ge=0, le=150)
    observations: Optional[str] = None
    profile_image: Optional[str] = Field(None, max_length=500)
    special_needs: Optional[dict] = None
    status: StudentStatus = StudentStatus.active


class StudentCreate(StudentBase):
    professional_id: str


class StudentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    registration: Optional[str] = Field(None, max_length=50)
    gender: Optional[Gender] = None
    birth_date: Optional[date] = None
    age: Optional[int] = Field(None, ge=0, le=150)
    observations: Optional[str] = None
    profile_image: Optional[str] = Field(None, max_length=500)
    special_needs: Optional[dict] = None
    status: Optional[StudentStatus] = None
    professional_id: Optional[str] = None


class StudentResponse(StudentBase):
    id: str
    professional_id: str
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class StudentListResponse(BaseModel):
    total: int
    active: int
    inactive: int
    students: list[StudentResponse]


class StudentTrackingPPMPoint(BaseModel):
    recording_id: str
    recorded_at: datetime
    words_per_minute: Optional[float] = None
    accuracy: Optional[float] = None


class StudentAttentionPoint(BaseModel):
    severity: Literal["info", "warning", "error", "success"] = "info"
    title: str
    description: str


class StudentInsightSummary(BaseModel):
    id: str
    title: str
    type: str
    priority: str
    created_at: datetime


class StudentTrackingResponse(BaseModel):
    student_id: str
    student_name: Optional[str] = None
    total_recordings: int
    completed_activities: int
    average_accuracy: Optional[float] = None
    average_wpm: Optional[float] = None
    current_ppm: Optional[float] = None
    ppm_change_percentage: Optional[float] = None
    ppm_history: List[StudentTrackingPPMPoint]
    attention_points: List[StudentAttentionPoint]
    recent_insights: List[StudentInsightSummary]

    class Config:
        from_attributes = True

