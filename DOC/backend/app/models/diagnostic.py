from sqlalchemy import Column, String, Enum, Float, Text, ForeignKey, DateTime, func, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid
from app.database import Base
import enum


class DiagnosticType(str, enum.Enum):
    initial = "initial"
    ongoing = "ongoing"
    final = "final"


class Diagnostic(Base):
    __tablename__ = "diagnostics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    conducted_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    diagnostic_type = Column(Enum(DiagnosticType), nullable=False, index=True)
    overall_score = Column(Float, nullable=True)
    reading_level = Column(String(50), nullable=True)
    strengths = Column(JSONB, nullable=True)
    difficulties = Column(JSONB, nullable=True)
    recommendations = Column(Text, nullable=True)
    ai_insights = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    student = relationship("Student", back_populates="diagnostics", foreign_keys=[student_id])
    updater = relationship("User", foreign_keys=[updated_by])
    conductor = relationship("User", foreign_keys=[conducted_by])

    __table_args__ = (
        Index("idx_diagnostics_student_created", "student_id", "created_at"),
        Index("idx_diagnostics_difficulties", "difficulties", postgresql_using="gin"),
    )

