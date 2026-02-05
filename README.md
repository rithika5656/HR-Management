# HR Management System - KITE

HR Recruitment Portal for KGiSL Institute of Technology (KITE)

## Features

- Job posting and management
- Candidate applications with resume upload
- HR Dashboard for tracking candidates
- Recruitment pipeline (Applied → Shortlisted → Interview → Selected)

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** FastAPI (Python)
- **Database:** In-memory JSON storage

## Setup

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Screenshots

The app features KITE college branding with navy blue and orange theme.

## Author

KITE - KGiSL Institute of Technology
