# HR Management System - Recruitment Module

A complete, production-ready Recruitment Module for HR Management System built for **BE CSE AIML Project**.

## Features

### 1. Job Management (HR Side)
- Create Job (title, department, skills, experience, salary, location)
- List all jobs with search and filter
- Filter open/closed jobs
- Update job status (Open, Closed, On Hold)
- Delete job

### 2. Candidate Application (Public Side)
- List only open jobs
- View job details
- Apply for job with form
- Upload resume (PDF/DOC, max 5MB)
- Automatic status = "Applied"

### 3. Candidate Tracking (HR Dashboard)
- View candidates by job ID
- Update candidate status: `Applied → Shortlisted → Interview → Selected / Rejected`
- Dashboard statistics (Total Jobs, Open Jobs, Total Candidates, Selected)
- Count applicants per job
- Download candidate resumes

### 4. File Upload
- Store resumes in `backend/uploads/resumes/`
- Save file path in MongoDB
- Resume download from HR dashboard

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | MongoDB (Motor async driver) |
| State | React Hooks |
| HTTP Client | Axios |
| File Upload | python-multipart |

## Project Structure

```
HR-MANAG/
├── backend/
│   ├── .env                    # Environment variables
│   ├── requirements.txt        # Python dependencies
│   ├── uploads/
│   │   └── resumes/           # Uploaded resume files
│   └── app/
│       ├── __init__.py
│       ├── config.py          # Configuration settings
│       ├── database.py        # MongoDB connection
│       ├── main.py            # FastAPI app entry
│       ├── models/
│       │   ├── job.py         # Job Pydantic models
│       │   └── candidate.py   # Candidate Pydantic models
│       └── routers/
│           ├── jobs.py        # Job CRUD routes
│           └── candidates.py  # Candidate routes + resume
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── components/
        │   ├── Navbar.jsx
        │   ├── JobCard.jsx
        │   ├── JobForm.jsx
        │   ├── CandidateTable.jsx
        │   └── ApplicationForm.jsx
        ├── pages/
        │   ├── HomePage.jsx
        │   ├── JobsPage.jsx
        │   ├── JobDetailPage.jsx
        │   ├── CreateJobPage.jsx
        │   ├── ApplyPage.jsx
        │   ├── HRDashboard.jsx
        │   └── CandidatesPage.jsx
        └── services/
            └── api.js         # Axios API service
```

## MongoDB Schema Design

### Jobs Collection
```javascript
{
  _id: ObjectId,
  job_title: String,
  department: String,
  skills: [String],
  experience: String,
  salary: String,
  location: String,
  status: "Open" | "Closed" | "On Hold",
  created_at: DateTime,
  updated_at: DateTime,
  created_by: String
}
```

### Candidates Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  job_id: String,
  resume_filename: String,
  resume_path: String,
  status: "Applied" | "Shortlisted" | "Interview" | "Selected" | "Rejected",
  applied_at: DateTime,
  updated_at: DateTime
}
```

## REST API Endpoints

### Jobs API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/jobs/` | Create new job |
| GET | `/api/jobs/` | Get all jobs |
| GET | `/api/jobs/open` | Get only open jobs |
| GET | `/api/jobs/{id}` | Get job by ID |
| PUT | `/api/jobs/{id}` | Update job |
| DELETE | `/api/jobs/{id}` | Delete job |

### Candidates API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/apply` | Apply for job (multipart form) |
| GET | `/api/candidates` | Get all candidates |
| GET | `/api/candidates/{job_id}` | Get candidates by job |
| GET | `/api/candidate/{id}` | Get candidate by ID |
| PUT | `/api/candidate/status/{id}` | Update candidate status |
| GET | `/api/resume/{candidate_id}` | Download resume |
| GET | `/api/dashboard/stats` | Get dashboard statistics |

### API Request/Response Examples

#### Create Job
```bash
POST /api/jobs/
Content-Type: application/json

{
  "job_title": "Software Engineer",
  "department": "Engineering",
  "skills": ["Python", "React", "MongoDB"],
  "experience": "2-4 years",
  "salary": "₹8,00,000 - ₹12,00,000",
  "location": "Coimbatore"
}

Response: 201 Created
{
  "id": "65f1a2b3c4d5e6f7a8b9c0d1",
  "job_title": "Software Engineer",
  ...
}
```

#### Apply for Job
```bash
POST /api/apply
Content-Type: multipart/form-data

name: John Doe
email: john@example.com
phone: 9876543210
job_id: 65f1a2b3c4d5e6f7a8b9c0d1
resume: [file.pdf]

Response: 201 Created
{
  "id": "65f2b3c4d5e6f7a8b9c0d1e2",
  "name": "John Doe",
  "status": "Applied",
  ...
}
```

#### Update Candidate Status
```bash
PUT /api/candidate/status/65f2b3c4d5e6f7a8b9c0d1e2
Content-Type: application/json

{
  "status": "Shortlisted"
}
```

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB 6.0+ (running on localhost:27017)

### 1. Start MongoDB

**Windows (MongoDB Compass or Service):**
```bash
# MongoDB should be running as a service
# Or start manually:
mongod --dbpath "C:\data\db"
```

**Or use MongoDB Atlas (Cloud):**
Update `backend/.env`:
```
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
```

### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment (Windows)
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000
```

Backend will be available at: http://localhost:8000
API Docs: http://localhost:8000/docs

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at: http://localhost:5173

## Environment Variables

### Backend (`backend/.env`)
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=hr_recruitment
HOST=0.0.0.0
PORT=8000
DEBUG=True
UPLOAD_DIR=uploads/resumes
MAX_UPLOAD_SIZE=5242880
```

## Frontend-Backend Connection

The frontend connects to the backend via Axios HTTP client:

```javascript
// frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})
```

**CORS Configuration** in backend allows requests from:
- http://localhost:3000
- http://localhost:5173

## Candidate Status Flow

```
Applied → Shortlisted → Interview → Selected
                                  ↘ Rejected
```

## Screenshots

| Page | Description |
|------|-------------|
| Home | Landing page with KITE branding |
| Jobs | Public job listings with search/filter |
| Apply | Job application form with resume upload |
| HR Dashboard | Statistics and job management |
| Candidates | Candidate tracking with status updates |

## Error Handling

- All API endpoints return proper HTTP status codes
- Validation errors return 400 Bad Request with details
- Not found resources return 404
- Server errors return 500 with error message

## Best Practices Implemented

- ✅ REST API design principles
- ✅ Pydantic models for validation
- ✅ Async MongoDB operations (Motor)
- ✅ Environment variables for configuration
- ✅ CORS middleware for cross-origin requests
- ✅ File upload validation (type, size)
- ✅ Proper error handling
- ✅ Component-based React architecture
- ✅ Axios interceptors for API calls
- ✅ Tailwind CSS for styling

## Author

**BE CSE AIML Project**
KGiSL Institute of Technology (KITE)
