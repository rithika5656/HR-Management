"""Candidate routes for job application and management."""
import os
import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form
from bson import ObjectId

from app.database import get_database
from app.models.candidate import CandidateStatus, CandidateStatusUpdate, CandidateResponse

router = APIRouter(tags=["Candidates"])

# Directory for storing uploaded resumes
UPLOAD_DIR = "uploads/resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Allowed file extensions for resume upload
ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx"}


def candidate_helper(candidate: dict) -> dict:
    """Convert MongoDB candidate document to response format."""
    return {
        "id": str(candidate["_id"]),
        "name": candidate["name"],
        "email": candidate["email"],
        "phone": candidate["phone"],
        "job_id": candidate["job_id"],
        "resume_filename": candidate.get("resume_filename"),
        "status": candidate["status"],
        "applied_at": candidate["applied_at"],
        "updated_at": candidate["updated_at"]
    }


def validate_file_extension(filename: str) -> bool:
    """Validate that the file has an allowed extension."""
    ext = os.path.splitext(filename)[1].lower()
    return ext in ALLOWED_EXTENSIONS


@router.post("/apply", response_model=CandidateResponse, status_code=status.HTTP_201_CREATED)
async def apply_for_job(
    name: str = Form(..., description="Candidate name"),
    email: str = Form(..., description="Candidate email"),
    phone: str = Form(..., description="Candidate phone number"),
    job_id: str = Form(..., description="Job ID to apply for"),
    resume: UploadFile = File(..., description="Resume file (PDF/DOC)")
):
    """
    Apply for a job posting.
    
    - **name**: Candidate's full name
    - **email**: Candidate's email address
    - **phone**: Candidate's phone number
    - **job_id**: ID of the job being applied for
    - **resume**: Resume file (PDF or DOC format)
    
    Returns the created application with default status "Applied".
    """
    db = get_database()
    
    # Validate job_id format
    if not ObjectId.is_valid(job_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid job ID format"
        )
    
    # Check if job exists and is open
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    if job["status"] != "Open":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This job is no longer accepting applications"
        )
    
    # Validate resume file
    if not resume.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume file is required"
        )
    
    if not validate_file_extension(resume.filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF and DOC files are allowed"
        )
    
    # Check for duplicate application (same email for same job)
    existing_application = await db.candidates.find_one({
        "email": email,
        "job_id": job_id
    })
    if existing_application:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied for this job"
        )
    
    # Save resume file
    file_ext = os.path.splitext(resume.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as f:
        content = await resume.read()
        f.write(content)
    
    # Create candidate document
    candidate_data = {
        "name": name,
        "email": email,
        "phone": phone,
        "job_id": job_id,
        "resume_filename": resume.filename,
        "resume_path": file_path,
        "status": CandidateStatus.APPLIED.value,
        "applied_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.candidates.insert_one(candidate_data)
    created_candidate = await db.candidates.find_one({"_id": result.inserted_id})
    
    return candidate_helper(created_candidate)


@router.get("/candidates/{job_id}", response_model=List[CandidateResponse])
async def get_candidates_by_job(job_id: str):
    """
    Get all candidates for a specific job (HR only).
    
    - **job_id**: The unique job identifier
    
    Returns a list of all candidates who applied for the job.
    """
    db = get_database()
    
    # Validate job_id format
    if not ObjectId.is_valid(job_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid job ID format"
        )
    
    # Check if job exists
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    candidates = []
    async for candidate in db.candidates.find({"job_id": job_id}).sort("applied_at", -1):
        candidates.append(candidate_helper(candidate))
    
    return candidates


@router.put("/candidate/status/{candidate_id}", response_model=CandidateResponse)
async def update_candidate_status(candidate_id: str, status_update: CandidateStatusUpdate):
    """
    Update candidate status (HR only).
    
    - **candidate_id**: The unique candidate identifier
    - **status**: New status (Applied, Shortlisted, Interview, Selected, Rejected)
    
    Valid status transitions:
    - Applied → Shortlisted → Interview → Selected/Rejected
    """
    db = get_database()
    
    # Validate candidate_id format
    if not ObjectId.is_valid(candidate_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid candidate ID format"
        )
    
    # Check if candidate exists
    candidate = await db.candidates.find_one({"_id": ObjectId(candidate_id)})
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )
    
    # Update candidate status
    await db.candidates.update_one(
        {"_id": ObjectId(candidate_id)},
        {
            "$set": {
                "status": status_update.status.value,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    updated_candidate = await db.candidates.find_one({"_id": ObjectId(candidate_id)})
    return candidate_helper(updated_candidate)


@router.get("/candidates", response_model=List[CandidateResponse])
async def get_all_candidates():
    """
    Get all candidates across all jobs (HR only).
    
    Returns a list of all candidates.
    """
    db = get_database()
    candidates = []
    
    async for candidate in db.candidates.find().sort("applied_at", -1):
        candidates.append(candidate_helper(candidate))
    
    return candidates


@router.get("/candidate/{candidate_id}", response_model=CandidateResponse)
async def get_candidate(candidate_id: str):
    """
    Get a specific candidate by ID.
    
    - **candidate_id**: The unique candidate identifier
    """
    db = get_database()
    
    if not ObjectId.is_valid(candidate_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid candidate ID format"
        )
    
    candidate = await db.candidates.find_one({"_id": ObjectId(candidate_id)})
    
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )
    
    return candidate_helper(candidate)
