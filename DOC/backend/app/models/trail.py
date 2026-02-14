from sqlalchemy import Column, String, Text, Enum, Boolean, Integer, ForeignKey, DateTime, func, Index
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
import uuid
from app.database import Base
import enum


class TrailDifficulty(str, enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"


class Trail(Base):
    __tablename__ = "trails"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    difficulty = Column(Enum(TrailDifficulty), nullable=False, index=True)
    is_default = Column(Boolean, default=False)
    age_range_min = Column(Integer, nullable=True)
    age_range_max = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    creator = relationship("User", foreign_keys=[created_by])
    updater = relationship("User", foreign_keys=[updated_by])
    stories = relationship("TrailStory", back_populates="trail", cascade="all, delete-orphan")
    student_progress = relationship("StudentTrailProgress", back_populates="trail")


class TrailStory(Base):
    __tablename__ = "trail_stories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trail_id = Column(UUID(as_uuid=True), ForeignKey("trails.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    subtitle = Column(String(255), nullable=True)
    content = Column(Text, nullable=False)
    letters_focus = Column(ARRAY(String), nullable=True)
    phonemes_focus = Column(ARRAY(String), nullable=True)
    order_position = Column(Integer, nullable=False)
    difficulty = Column(Enum(TrailDifficulty), nullable=True)
    word_count = Column(Integer, nullable=True)
    estimated_time = Column(Integer, nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    trail = relationship("Trail", back_populates="stories")
    creator = relationship("User", foreign_keys=[created_by])
    updater = relationship("User", foreign_keys=[updated_by])
    recordings = relationship("Recording", back_populates="story")

    __table_args__ = (
        Index("idx_trail_stories_order", "trail_id", "order_position"),
    )

