from datetime import datetime, date, time
from typing import Optional, List

from pydantic import BaseModel, Field

from app.models.activity import ActivityStatus, ActivityType, ActivityDifficulty


class StudentActivityBase(BaseModel):
    student_id: str = Field(..., description="ID do estudante")
    activity_id: str = Field(..., description="ID da atividade")
    status: ActivityStatus = ActivityStatus.pending
    score: Optional[float] = None
    notes: Optional[str] = None
    completed_at: Optional[datetime] = None


class StudentActivityCreate(StudentActivityBase):
    pass


class StudentActivityUpdate(BaseModel):
    status: Optional[ActivityStatus] = None
    score: Optional[float] = None
    notes: Optional[str] = None
    completed_at: Optional[datetime] = None


class ActivitySummary(BaseModel):
    id: str
    title: str
    type: ActivityType
    difficulty: Optional[ActivityDifficulty] = None
    scheduled_date: Optional[date] = None
    scheduled_time: Optional[time] = None

    class Config:
        from_attributes = True


class StudentActivityResponse(BaseModel):
    id: str
    student_id: str
    activity_id: str
    status: ActivityStatus
    score: Optional[float]
    notes: Optional[str]
    completed_at: Optional[datetime]
    activity: Optional[ActivitySummary] = None

    class Config:
        from_attributes = True


class StudentActivityListResponse(BaseModel):
    student_activities: List[StudentActivityResponse]
    total: int

