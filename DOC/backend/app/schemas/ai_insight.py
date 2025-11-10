from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, Field

from app.models.ai_insight import InsightType, InsightPriority


class AIInsightBase(BaseModel):
    professional_id: str = Field(..., description="ID do profissional responsável")
    insight_type: InsightType
    priority: InsightPriority = InsightPriority.medium
    title: str
    description: str
    related_students: List[str] = Field(default_factory=list)
    expires_at: Optional[datetime] = None
    is_read: bool = False


class AIInsightCreate(AIInsightBase):
    pass


class AIInsightUpdate(BaseModel):
    insight_type: Optional[InsightType] = None
    priority: Optional[InsightPriority] = None
    title: Optional[str] = None
    description: Optional[str] = None
    related_students: Optional[List[str]] = None
    expires_at: Optional[datetime] = None
    is_read: Optional[bool] = None


class AIInsightResponse(BaseModel):
    id: str
    professional_id: str
    insight_type: InsightType
    priority: InsightPriority
    title: str
    description: str
    related_students: List[str]
    is_read: bool
    created_at: datetime
    expires_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AIInsightListResponse(BaseModel):
    insights: List[AIInsightResponse]
    total: int

