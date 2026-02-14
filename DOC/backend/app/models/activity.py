from sqlalchemy import Column, String, Text, Enum, Date, Time, Float, ForeignKey, DateTime, func, Index, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
import uuid
from app.database import Base
import enum


class ActivityType(str, enum.Enum):
    reading = "reading"
    writing = "writing"
    diagnostic = "diagnostic"


class ActivityDifficulty(str, enum.Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class ActivityStatus(str, enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"


class Activity(Base):
    __tablename__ = "activities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    type = Column(Enum(ActivityType), nullable=False)
    difficulty = Column(Enum(ActivityDifficulty), nullable=True)
    scheduled_date = Column(Date, nullable=True, index=True)
    scheduled_time = Column(Time, nullable=True)
    words = Column(ARRAY(String), nullable=True)
    status = Column(Enum(ActivityStatus), nullable=False, default=ActivityStatus.pending, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    creator = relationship("User", foreign_keys=[created_by])
    updater = relationship("User", foreign_keys=[updated_by])
    student_activities = relationship("StudentActivity", back_populates="activity", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_activities_created_scheduled", "created_by", "scheduled_date"),
    )


class StudentActivity(Base):
    __tablename__ = "student_activities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    activity_id = Column(UUID(as_uuid=True), ForeignKey("activities.id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum(ActivityStatus), nullable=False, default=ActivityStatus.pending)
    score = Column(Float, nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)

    student = relationship("Student", foreign_keys=[student_id])
    activity = relationship("Activity", back_populates="student_activities")

    __table_args__ = (
        UniqueConstraint("student_id", "activity_id", name="unique_student_activity"),
    )

