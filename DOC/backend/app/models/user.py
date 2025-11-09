import enum
import uuid

from sqlalchemy import Boolean, Column, DateTime, Enum, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class UserRole(str, enum.Enum):
    admin = "admin"
    professional = "professional"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, index=True)
    function = Column(String(255), nullable=True)
    username = Column(String(255), unique=True, nullable=True, index=True)
    google_id = Column(String(255), unique=True, nullable=True)
    # active flag to enable/disable professional login and mark status
    active = Column(
        Boolean, nullable=False, default=True, server_default="true", index=True
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    students = relationship(
        "Student",
        back_populates="professional",
        foreign_keys="Student.professional_id",
        passive_deletes="all",
    )

    @property
    def status(self) -> str:
        """
        Convenience property returning a string status compatible with the frontend.
        Returns 'active' when `active` is truthy, otherwise 'inactive'.
        """
        return "active" if self.active else "inactive"
