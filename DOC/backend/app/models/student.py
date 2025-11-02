from sqlalchemy import Column, String, Enum, Date, Integer, Text, ForeignKey, DateTime, func, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid
from app.database import Base
import enum


class StudentStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"


class Gender(str, enum.Enum):
    male = "male"
    female = "female"
    other = "other"


class Student(Base):
    __tablename__ = "students"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    professional_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    registration = Column(String(50), nullable=True)
    gender = Column(Enum(Gender), nullable=True)
    birth_date = Column(Date, nullable=True)
    age = Column(Integer, nullable=True)
    observations = Column(Text, nullable=True)
    profile_image = Column(String(500), nullable=True)
    special_needs = Column(JSONB, nullable=True)
    status = Column(Enum(StudentStatus), nullable=False, default=StudentStatus.active, index=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    professional = relationship("User", foreign_keys=[professional_id])
    creator = relationship("User", foreign_keys=[created_by])
    updater = relationship("User", foreign_keys=[updated_by])
    
    recordings = relationship("Recording", back_populates="student", cascade="all, delete-orphan")
    diagnostics = relationship("Diagnostic", back_populates="student", cascade="all, delete-orphan")
    trail_progress = relationship("StudentTrailProgress", back_populates="student", cascade="all, delete-orphan")
    student_activities = relationship("StudentActivity", back_populates="student", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_students_name_gin", "name", postgresql_using="gin", postgresql_ops={"name": "gin_trgm_ops"}),
    )

