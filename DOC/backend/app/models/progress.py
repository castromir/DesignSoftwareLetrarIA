from sqlalchemy import Column, ForeignKey, Float, DateTime, func, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
import uuid
from app.database import Base


class StudentTrailProgress(Base):
    __tablename__ = "student_trail_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    trail_id = Column(UUID(as_uuid=True), ForeignKey("trails.id", ondelete="CASCADE"), nullable=False, index=True)
    current_story_id = Column(UUID(as_uuid=True), ForeignKey("trail_stories.id", ondelete="SET NULL"), nullable=True)
    completed_stories = Column(ARRAY(UUID(as_uuid=True)), default=[], nullable=False)
    progress_percentage = Column(Float, default=0.0, nullable=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    last_accessed_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    student = relationship("Student", back_populates="trail_progress")
    trail = relationship("Trail", back_populates="student_progress")
    current_story = relationship("TrailStory")

    __table_args__ = (
        UniqueConstraint("student_id", "trail_id", name="unique_student_trail"),
    )

