import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import JobsPage from './pages/JobsPage'
import CreateJobPage from './pages/CreateJobPage'
import JobDetailPage from './pages/JobDetailPage'
import ApplyPage from './pages/ApplyPage'
import CandidatesPage from './pages/CandidatesPage'
import HRDashboard from './pages/HRDashboard'

function App() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <Navbar />
      <main className={isHomePage ? '' : 'container mx-auto px-4 py-8'}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/create" element={<CreateJobPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/apply/:jobId" element={<ApplyPage />} />
          <Route path="/hr/dashboard" element={<HRDashboard />} />
          <Route path="/hr/candidates/:jobId" element={<CandidatesPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
