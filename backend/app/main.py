"""Main FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import connect_to_mongo, close_mongo_connection
from app.routers import jobs, candidates


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for startup and shutdown events."""
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()


app = FastAPI(
    title="HR Management System - Recruitment Module",
    description="""
    Recruitment Module API for HR Management System.
    
    ## Features
    
    * **Job Posting** - HR can create, update, and manage job postings
    * **Job Viewing** - Candidates can view available job openings
    * **Job Application** - Candidates can apply with resume upload
    * **Candidate Management** - HR can track and update candidate status
    
    ## Status Flow
    
    Candidate status progression:
    `Applied` → `Shortlisted` → `Interview` → `Selected` / `Rejected`
    """,
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(jobs.router, prefix="/api")
app.include_router(candidates.router, prefix="/api")


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information."""
    return {
        "message": "HR Management System - Recruitment Module API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "jobs": "/api/jobs",
            "apply": "/api/apply",
            "candidates": "/api/candidates/{job_id}",
            "update_status": "/api/candidate/status/{candidate_id}"
        }
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
