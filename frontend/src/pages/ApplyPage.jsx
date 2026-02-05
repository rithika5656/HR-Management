import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { jobApi } from '../services/api'
import ApplicationForm from '../components/ApplicationForm'

function ApplyPage() {
  const { jobId } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { fetchJob() }, [jobId])

  const fetchJob = async () => {
    try {
      setLoading(true)
      const response = await jobApi.getById(jobId)
      setJob(response.data)
    } catch (err) {
      setError('Failed to load job details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div></div>
  if (error || !job) return <div className="text-center py-12"><p className="text-red-600">{error || 'Job not found'}</p><Link to="/jobs" className="mt-4 text-primary-600 hover:underline">Back to Jobs</Link></div>
  if (job.status !== 'Open') return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <h2 className="mt-4 text-2xl font-bold text-gray-900">This job is no longer accepting applications</h2>
      <p className="mt-2 text-gray-600">The job posting for "{job.job_title}" is currently {job.status}.</p>
      <Link to="/jobs" className="mt-6 inline-block px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700">Browse Other Jobs</Link>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <Link to={`/jobs/${jobId}`} className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-6">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Job Details
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for Position</h1>
        <p className="text-gray-600">Fill out the form below to submit your application</p>
      </div>
      <ApplicationForm jobId={jobId} jobTitle={job.job_title} />
    </div>
  )
}

export default ApplyPage
