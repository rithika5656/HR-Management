"""Job Pydantic models for MongoDB schema."""
from datetime import datetime
from typing import Optional, List
from enum import Enum
from pydantic import BaseModel, Field


class JobStatus(str, Enum):
    """Job status enumeration."""
    OPEN = "Open"
    CLOSED = "Closed"
    ON_HOLD = "On Hold"


class JobBase(BaseModel):
    """Base job model with common fields."""
    job_title: str = Field(..., min_length=1, max_length=200, description="Job title")
    department: str = Field(..., min_length=1, max_length=100, description="Department name")
    skills: List[str] = Field(..., min_length=1, description="Required skills")
    experience: str = Field(..., description="Experience requirement (e.g., '2-5 years')")
    salary: str = Field(..., description="Salary range (e.g., '$50,000 - $70,000')")
    location: str = Field(..., min_length=1, max_length=200, description="Job location")


class JobCreate(JobBase):
    """Model for creating a new job."""
    pass


class JobUpdate(BaseModel):
    """Model for updating a job."""
    job_title: Optional[str] = Field(None, min_length=1, max_length=200)
    department: Optional[str] = Field(None, min_length=1, max_length=100)
    skills: Optional[List[str]] = Field(None, min_length=1)
    experience: Optional[str] = None
    salary: Optional[str] = None
    location: Optional[str] = Field(None, min_length=1, max_length=200)
    status: Optional[JobStatus] = None


class Job(JobBase):
    """Complete job model stored in MongoDB."""
    id: Optional[str] = Field(None, alias="_id")
    status: JobStatus = Field(default=JobStatus.OPEN, description="Job status")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: str = Field(default="HR", description="User who created the job")

    class Config:
        populate_by_name = True
        use_enum_values = True


class JobResponse(BaseModel):
    """Job response model for API responses."""
    id: str
    job_title: str
    department: str
    skills: List[str]
    experience: str
    salary: str
    location: str
    status: str
    created_at: datetime
    updated_at: datetime
    created_by: str

    class Config:
        populate_by_name = True
