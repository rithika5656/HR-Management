"""Candidate Pydantic models for MongoDB schema."""
from datetime import datetime
from typing import Optional
from enum import Enum
from pydantic import BaseModel, Field, EmailStr


class CandidateStatus(str, Enum):
    """Candidate status enumeration for tracking hiring process."""
    APPLIED = "Applied"
    SHORTLISTED = "Shortlisted"
    INTERVIEW = "Interview"
    SELECTED = "Selected"
    REJECTED = "Rejected"


class CandidateBase(BaseModel):
    """Base candidate model with common fields."""
    name: str = Field(..., min_length=1, max_length=200, description="Candidate name")
    email: EmailStr = Field(..., description="Candidate email")
    phone: str = Field(..., min_length=10, max_length=20, description="Phone number")


class CandidateCreate(CandidateBase):
    """Model for creating a new candidate application."""
    job_id: str = Field(..., description="ID of the job being applied for")


class CandidateStatusUpdate(BaseModel):
    """Model for updating candidate status."""
    status: CandidateStatus = Field(..., description="New candidate status")


class Candidate(CandidateBase):
    """Complete candidate model stored in MongoDB."""
    id: Optional[str] = Field(None, alias="_id")
    job_id: str = Field(..., description="ID of the job applied for")
    resume_filename: Optional[str] = Field(None, description="Uploaded resume filename")
    resume_path: Optional[str] = Field(None, description="Path to uploaded resume")
    status: CandidateStatus = Field(default=CandidateStatus.APPLIED, description="Application status")
    applied_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        use_enum_values = True


class CandidateResponse(BaseModel):
    """Candidate response model for API responses."""
    id: str
    name: str
    email: str
    phone: str
    job_id: str
    resume_filename: Optional[str]
    status: str
    applied_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
