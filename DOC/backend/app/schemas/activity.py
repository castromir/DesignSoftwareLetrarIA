from pydantic import BaseModel, field_validator, field_serializer
from typing import Optional, List, Union
from datetime import date, datetime, time
from app.models.activity import ActivityType, ActivityDifficulty, ActivityStatus


class ActivityBase(BaseModel):
    title: str
    description: Optional[str] = None
    type: ActivityType
    difficulty: Optional[ActivityDifficulty] = None
    scheduled_date: Optional[date] = None
    scheduled_time: Optional[Union[time, str]] = None
    words: Optional[List[str]] = None
    status: Optional[ActivityStatus] = ActivityStatus.pending

    @field_validator('scheduled_time', mode='before')
    @classmethod
    def parse_time(cls, v):
        if isinstance(v, str):
            try:
                parts = v.split(':')
                if len(parts) >= 2:
                    return time(int(parts[0]), int(parts[1]))
            except (ValueError, IndexError):
                pass
        return v


class ActivityCreate(ActivityBase):
    student_ids: List[str]


class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[ActivityType] = None
    difficulty: Optional[ActivityDifficulty] = None
    scheduled_date: Optional[date] = None
    scheduled_time: Optional[Union[time, str]] = None
    words: Optional[List[str]] = None
    status: Optional[ActivityStatus] = None
    student_ids: Optional[List[str]] = None

    @field_validator('scheduled_time', mode='before')
    @classmethod
    def parse_time(cls, v):
        if isinstance(v, str):
            try:
                parts = v.split(':')
                if len(parts) >= 2:
                    return time(int(parts[0]), int(parts[1]))
            except (ValueError, IndexError):
                pass
        return v


class ActivityResponse(ActivityBase):
    id: str
    created_by: str
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: datetime
    student_ids: List[str]

    class Config:
        from_attributes = True

    @field_serializer('scheduled_time')
    def serialize_time(self, v, _info):
        if v is None:
            return None
        if isinstance(v, time):
            return v.strftime('%H:%M:%S')
        return v


class ActivityListResponse(BaseModel):
    total: int
    pending: int
    in_progress: int
    completed: int
    activities: List[ActivityResponse]

