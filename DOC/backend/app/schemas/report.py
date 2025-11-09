from datetime import date, datetime
from typing import Optional, List

from pydantic import BaseModel, Field

from app.models.report import ReportType, ReportFormat


class ReportBase(BaseModel):
    student_id: str = Field(..., description="ID do estudante")
    report_type: ReportType
    format: ReportFormat
    period_start: Optional[date] = None
    period_end: Optional[date] = None
    file_path: Optional[str] = Field(None, max_length=500)
    file_url: Optional[str] = Field(None, max_length=500)


class ReportCreate(ReportBase):
    pass


class ReportUpdate(BaseModel):
    report_type: Optional[ReportType] = None
    format: Optional[ReportFormat] = None
    period_start: Optional[date] = None
    period_end: Optional[date] = None
    file_path: Optional[str] = None
    file_url: Optional[str] = None


class ReportResponse(BaseModel):
    id: str
    student_id: str
    generated_by: str
    report_type: ReportType
    format: ReportFormat
    period_start: Optional[date]
    period_end: Optional[date]
    file_path: Optional[str]
    file_url: Optional[str]
    generated_at: datetime
    updated_by: Optional[str]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class ReportListResponse(BaseModel):
    reports: List[ReportResponse]
    total: int

