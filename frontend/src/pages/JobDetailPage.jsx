import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { jobApi } from '../services/api'
import JobForm from '../components/JobForm'

function JobDetailPage() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => { fetchJob() }, [id])

  const fetchJob = async () => {
    try {
      setLoading(true)
      const response = await jobApi.getById(id)
      setJob(response.data)
    } catch (err) {
      setError('Failed to load job details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div></div>
  if (error) return <div className="text-center py-12"><p className="text-red-600">{error}</p><Link to="/jobs" className="mt-4 text-primary-600 hover:underline">Back to Jobs</Link></div>
  if (!job) return null

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Job</h1></div>
        <JobForm initialData={job} isEditing={true} />
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) { case 'Open': return 'bg-green-100 text-green-800'; case 'Closed': return 'bg-red-100 text-red-800'; default: return 'bg-yellow-100 text-yellow-800' }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/jobs" className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-6">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Jobs
      </Link>
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.job_title}</h1>
            <p className="text-xl text-gray-600">{job.department}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>{job.status}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center"><div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4"><svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg></div><div><p className="text-sm text-gray-500">Location</p><p className="font-medium text-gray-900">{job.location}</p></div></div>
          <div className="flex items-center"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4"><svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><div><p className="text-sm text-gray-500">Salary</p><p className="font-medium text-gray-900">{job.salary}</p></div></div>
          <div className="flex items-center"><div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4"><svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><div><p className="text-sm text-gray-500">Experience</p><p className="font-medium text-gray-900">{job.experience}</p></div></div>
          <div className="flex items-center"><div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4"><svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div><div><p className="text-sm text-gray-500">Posted On</p><p className="font-medium text-gray-900">{new Date(job.created_at).toLocaleDateString()}</p></div></div>
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
          <div className="flex flex-wrap gap-2">{job.skills.map((skill, i) => <span key={i} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">{skill}</span>)}</div>
        </div>
        <div className="flex flex-wrap gap-4 pt-6 border-t">
          {job.status === 'Open' && <Link to={`/apply/${job.id}`} className="px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700">Apply for this Job</Link>}
          <button onClick={() => setIsEditing(true)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50">Edit Job (HR)</button>
          <Link to={`/hr/candidates/${job.id}`} className="px-6 py-3 border border-primary-600 text-primary-600 rounded-md font-medium hover:bg-primary-50">View Candidates (HR)</Link>
        </div>
      </div>
    </div>
  )
}

export default JobDetailPage
