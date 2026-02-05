"""Job routes for HR job posting functionality."""
from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, status
from bson import ObjectId

from app.database import get_database
from app.models.job import JobCreate, JobUpdate, JobResponse, JobStatus

router = APIRouter(prefix="/jobs", tags=["Jobs"])


def job_helper(job: dict) -> dict:
    """Convert MongoDB job document to response format."""
    return {
        "id": str(job["_id"]),
        "job_title": job["job_title"],
        "department": job["department"],
        "skills": job["skills"],
        "experience": job["experience"],
        "salary": job["salary"],
        "location": job["location"],
        "status": job["status"],
        "created_at": job["created_at"],
        "updated_at": job["updated_at"],
        "created_by": job.get("created_by", "HR")
    }


@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(job: JobCreate):
    """
    Create a new job posting (HR only).
    
    - **job_title**: Title of the job position
    - **department**: Department name
    - **skills**: List of required skills
    - **experience**: Experience requirement
    - **salary**: Salary range
    - **location**: Job location
    
    Returns the created job with default status "Open".
    """
    db = get_database()
    
    job_data = {
        **job.model_dump(),
        "status": JobStatus.OPEN.value,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "created_by": "HR"
    }
    
    result = await db.jobs.insert_one(job_data)
    created_job = await db.jobs.find_one({"_id": result.inserted_id})
    
    return job_helper(created_job)


@router.get("/", response_model=List[JobResponse])
async def get_all_jobs():
    """
    Get all job postings.
    
    Returns a list of all jobs (both for HR management and candidate viewing).
    """
    db = get_database()
    jobs = []
    
    async for job in db.jobs.find().sort("created_at", -1):
        jobs.append(job_helper(job))
    
    return jobs


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(job_id: str):
    """
    Get a specific job by ID.
    
    - **job_id**: The unique job identifier
    """
    db = get_database()
    
    if not ObjectId.is_valid(job_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid job ID format"
        )
    
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    return job_helper(job)


@router.put("/{job_id}", response_model=JobResponse)
async def update_job(job_id: str, job_update: JobUpdate):
    """
    Update a job posting (HR only).
    
    - **job_id**: The unique job identifier
    - Only provided fields will be updated
    """
    db = get_database()
    
    if not ObjectId.is_valid(job_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid job ID format"
        )
    
    # Check if job exists
    existing_job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    if not existing_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Build update data (only non-None fields)
    update_data = {k: v for k, v in job_update.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.jobs.update_one(
        {"_id": ObjectId(job_id)},
        {"$set": update_data}
    )
    
    updated_job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    return job_helper(updated_job)


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(job_id: str):
    """
    Delete a job posting (HR only).
    
    - **job_id**: The unique job identifier
    """
    db = get_database()
    
    if not ObjectId.is_valid(job_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid job ID format"
        )
    
    result = await db.jobs.delete_one({"_id": ObjectId(job_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    return None
