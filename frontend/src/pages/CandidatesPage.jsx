import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { jobApi, candidateApi } from '../services/api'
import CandidateTable from '../components/CandidateTable'

function CandidatesPage() {
  const { jobId } = useParams()
  const [job, setJob] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { fetchData() }, [jobId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [jobResponse, candidatesResponse] = await Promise.all([jobApi.getById(jobId), candidateApi.getByJob(jobId)])
      setJob(jobResponse.data)
      setCandidates(candidatesResponse.data)
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div></div>
  if (error) return <div className="text-center py-12"><p className="text-red-600">{error}</p><Link to="/hr/dashboard" className="mt-4 text-primary-600 hover:underline">Back to Dashboard</Link></div>

  const statusCounts = candidates.reduce((acc, c) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc }, {})

  return (
    <div>
      <Link to="/hr/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-6">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Dashboard
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidates for {job?.job_title}</h1>
        <p className="text-gray-600">{job?.department} • {job?.location}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 text-center"><p className="text-3xl font-bold text-gray-900">{candidates.length}</p><p className="text-sm text-gray-600">Total</p></div>
        <div className="bg-blue-50 rounded-lg shadow-md p-4 text-center"><p className="text-3xl font-bold text-blue-600">{statusCounts['Applied'] || 0}</p><p className="text-sm text-blue-600">Applied</p></div>
        <div className="bg-yellow-50 rounded-lg shadow-md p-4 text-center"><p className="text-3xl font-bold text-yellow-600">{statusCounts['Shortlisted'] || 0}</p><p className="text-sm text-yellow-600">Shortlisted</p></div>
        <div className="bg-purple-50 rounded-lg shadow-md p-4 text-center"><p className="text-3xl font-bold text-purple-600">{statusCounts['Interview'] || 0}</p><p className="text-sm text-purple-600">Interview</p></div>
        <div className="bg-green-50 rounded-lg shadow-md p-4 text-center"><p className="text-3xl font-bold text-green-600">{statusCounts['Selected'] || 0}</p><p className="text-sm text-green-600">Selected</p></div>
      </div>
      <CandidateTable candidates={candidates} onStatusUpdate={fetchData} />
    </div>
  )
}

export default CandidatesPage
