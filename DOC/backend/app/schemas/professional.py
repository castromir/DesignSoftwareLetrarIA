from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime


class ProfessionalBase(BaseModel):
    name: str
    email: EmailStr
    function: Optional[str] = None


class ProfessionalCreate(ProfessionalBase):
    password: str
    username: Optional[str] = None


class ProfessionalUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    function: Optional[str] = None
    password: Optional[str] = None
    username: Optional[str] = None


class ProfessionalResponse(ProfessionalBase):
    id: str
    email: str
    name: str
    function: Optional[str] = None
    role: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ProfessionalListResponse(BaseModel):
    total: int
    active: int
    inactive: int
    professionals: list[ProfessionalResponse]

