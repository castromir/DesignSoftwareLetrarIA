from sqlalchemy import Column, String, Enum, Text, Boolean, ForeignKey, DateTime, Index, func
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
import uuid
from app.database import Base
import enum


class InsightType(str, enum.Enum):
    attention_needed = "attention_needed"
    progress = "progress"
    suggestion = "suggestion"


class InsightPriority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class AIInsight(Base):
    __tablename__ = "ai_insights"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    professional_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    insight_type = Column(Enum(InsightType), nullable=False)
    priority = Column(Enum(InsightPriority), nullable=False, default=InsightPriority.medium)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    related_students = Column(ARRAY(UUID(as_uuid=True)), nullable=True)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)

    professional = relationship("User", foreign_keys=[professional_id])

