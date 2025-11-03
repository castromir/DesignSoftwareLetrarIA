from sqlalchemy import Column, String, Text, Enum, Integer, Boolean, ForeignKey, DateTime, Index, func
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import relationship
import uuid
from app.database import Base
from app.models.trail import TrailDifficulty


class TextLibrary(Base):
    __tablename__ = "text_library"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    subtitle = Column(String(255), nullable=True)
    content = Column(Text, nullable=False)
    difficulty = Column(Enum(TrailDifficulty), nullable=False)
    age_range_min = Column(Integer, nullable=True)
    age_range_max = Column(Integer, nullable=True)
    letters_focus = Column(ARRAY(String), nullable=True)
    tags = Column(JSONB, nullable=True)
    word_count = Column(Integer, nullable=True)
    is_public = Column(Boolean, default=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    creator = relationship("User", foreign_keys=[created_by])
    updater = relationship("User", foreign_keys=[updated_by])

    __table_args__ = (
        Index("idx_text_library_title_gin", "title", postgresql_using="gin", postgresql_ops={"title": "gin_trgm_ops"}),
    )

