from sqlalchemy import Column, String, Enum, Float, Text, ForeignKey, DateTime, func, Index, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid
from app.database import Base
import enum


class RecordingStatus(str, enum.Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class Recording(Base):
    __tablename__ = "recordings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    story_id = Column(UUID(as_uuid=True), ForeignKey("trail_stories.id", ondelete="CASCADE"), nullable=False, index=True)
    audio_file_path = Column(String(500), nullable=True)
    audio_url = Column(String(500), nullable=True)
    duration_seconds = Column(Float, nullable=False)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    transcription = Column(Text, nullable=True)
    status = Column(Enum(RecordingStatus), nullable=False, default=RecordingStatus.pending, index=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    updated_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    student = relationship("Student", back_populates="recordings")
    creator = relationship("User", foreign_keys=[created_by])
    updater = relationship("User", foreign_keys=[updated_by])
    story = relationship("TrailStory", back_populates="recordings")
    analysis = relationship("RecordingAnalysis", back_populates="recording", uselist=False)

    __table_args__ = (
        Index("idx_recordings_student_date", "student_id", "recorded_at"),
    )


class RecordingAnalysis(Base):
    __tablename__ = "recording_analysis"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    recording_id = Column(UUID(as_uuid=True), ForeignKey("recordings.id", ondelete="CASCADE"), unique=True, nullable=False)
    fluency_score = Column(Float, CheckConstraint("fluency_score >= 0 AND fluency_score <= 100"), nullable=True)
    prosody_score = Column(Float, CheckConstraint("prosody_score >= 0 AND prosody_score <= 100"), nullable=True)
    speed_wpm = Column(Float, CheckConstraint("speed_wpm >= 0"), nullable=True)
    accuracy_score = Column(Float, CheckConstraint("accuracy_score >= 0 AND accuracy_score <= 100"), nullable=True)
    overall_score = Column(Float, CheckConstraint("overall_score >= 0 AND overall_score <= 100"), nullable=True)
    errors_detected = Column(JSONB, nullable=True)
    pauses_analysis = Column(JSONB, nullable=True)
    ai_feedback = Column(Text, nullable=True)
    ai_recommendations = Column(JSONB, nullable=True)
    processed_at = Column(DateTime(timezone=True), server_default=func.now())

    recording = relationship("Recording", back_populates="analysis")

    __table_args__ = (
        Index("idx_recording_analysis_errors", "errors_detected", postgresql_using="gin"),
    )

