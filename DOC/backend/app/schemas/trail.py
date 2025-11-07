from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.trail import TrailDifficulty


class TrailStoryBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    subtitle: Optional[str] = Field(None, max_length=255)
    content: str = Field(..., min_length=1)
    letters_focus: Optional[List[str]] = None
    phonemes_focus: Optional[List[str]] = None
    order_position: int = Field(..., ge=0)
    difficulty: Optional[TrailDifficulty] = None
    word_count: Optional[int] = Field(None, ge=0)
    estimated_time: Optional[int] = Field(None, ge=0)


class TrailStoryCreate(TrailStoryBase):
    trail_id: str


class TrailStoryUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    subtitle: Optional[str] = Field(None, max_length=255)
    content: Optional[str] = Field(None, min_length=1)
    letters_focus: Optional[List[str]] = None
    phonemes_focus: Optional[List[str]] = None
    order_position: Optional[int] = Field(None, ge=0)
    difficulty: Optional[TrailDifficulty] = None
    word_count: Optional[int] = Field(None, ge=0)
    estimated_time: Optional[int] = Field(None, ge=0)
    trail_id: Optional[str] = None


class TrailStoryResponse(TrailStoryBase):
    id: str
    trail_id: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: datetime

    class Config:
        from_attributes = True


class TrailBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    difficulty: TrailDifficulty
    is_default: bool = False
    age_range_min: Optional[int] = Field(None, ge=0, le=150)
    age_range_max: Optional[int] = Field(None, ge=0, le=150)


class TrailCreate(TrailBase):
    stories: Optional[List[TrailStoryBase]] = None


class TrailUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    difficulty: Optional[TrailDifficulty] = None
    is_default: Optional[bool] = None
    age_range_min: Optional[int] = Field(None, ge=0, le=150)
    age_range_max: Optional[int] = Field(None, ge=0, le=150)


class TrailResponse(TrailBase):
    id: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: datetime
    stories: List[TrailStoryResponse] = []

    class Config:
        from_attributes = True


class TrailListResponse(BaseModel):
    total: int
    trails: List[TrailResponse]

