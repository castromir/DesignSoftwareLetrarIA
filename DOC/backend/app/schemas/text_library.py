from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.trail import TrailDifficulty


class TextLibraryBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    subtitle: Optional[str] = Field(None, max_length=255)
    content: str = Field(..., min_length=1)
    difficulty: TrailDifficulty
    age_range_min: Optional[int] = Field(None, ge=0, le=150)
    age_range_max: Optional[int] = Field(None, ge=0, le=150)
    letters_focus: Optional[List[str]] = None
    tags: Optional[dict] = None
    word_count: Optional[int] = Field(None, ge=0)
    is_public: bool = True


class TextLibraryCreate(TextLibraryBase):
    pass


class TextLibraryUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    subtitle: Optional[str] = Field(None, max_length=255)
    content: Optional[str] = Field(None, min_length=1)
    difficulty: Optional[TrailDifficulty] = None
    age_range_min: Optional[int] = Field(None, ge=0, le=150)
    age_range_max: Optional[int] = Field(None, ge=0, le=150)
    letters_focus: Optional[List[str]] = None
    tags: Optional[dict] = None
    word_count: Optional[int] = Field(None, ge=0)
    is_public: Optional[bool] = None


class TextLibraryResponse(TextLibraryBase):
    id: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_by: Optional[str] = None
    updated_at: datetime

    class Config:
        from_attributes = True


class TextLibraryListResponse(BaseModel):
    total: int
    texts: List[TextLibraryResponse]

