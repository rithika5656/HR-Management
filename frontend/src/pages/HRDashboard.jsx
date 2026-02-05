import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobApi, candidateApi } from '../services/api'
import JobCard from '../components/JobCard'

function HRDashboard() {
  const [jobs, setJobs] = useState([])
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [jobsResponse, candidatesResponse] = await Promise.all([jobApi.getAll(), candidateApi.getAll()])
      setJobs(jobsResponse.data)
      setCandidates(candidatesResponse.data)
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div></div>
  if (error) return <div className="text-center py-12"><p className="text-red-600">{error}</p><button onClick={fetchData} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md">Retry</button></div>

  const openJobs = jobs.filter((j) => j.status === 'Open').length
  const selectedCandidates = candidates.filter((c) => c.status === 'Selected').length
  const interviewCandidates = candidates.filter((c) => c.status === 'Interview').length

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-kite-blue mb-2">HR Dashboard</h1>
          <p className="text-gray-600">Manage job postings and candidates - KITE Recruitment Portal</p>
        </div>
        <Link to="/jobs/create" className="px-6 py-3 bg-kite-blue text-white rounded-md font-medium hover:bg-primary-700 shadow-lg">+ Post New Job</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-kite-blue"><p className="text-sm text-gray-500">Total Jobs</p><p className="text-2xl font-bold text-kite-blue">{jobs.length}</p></div>
        <div className="bg-green-50 rounded-lg shadow-md p-4 border-l-4 border-green-500"><p className="text-sm text-green-600">Open Jobs</p><p className="text-2xl font-bold text-green-700">{openJobs}</p></div>
        <div className="bg-kite-light rounded-lg shadow-md p-4 border-l-4 border-kite-blue"><p className="text-sm text-kite-blue">Total Candidates</p><p className="text-2xl font-bold text-kite-blue">{candidates.length}</p></div>
        <div className="bg-emerald-50 rounded-lg shadow-md p-4 border-l-4 border-emerald-500"><p className="text-sm text-emerald-600">Selected</p><p className="text-2xl font-bold text-emerald-700">{selectedCandidates}</p></div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-t-4 border-kite-blue">
        <h2 className="text-xl font-semibold text-kite-blue mb-4">Recent Applications</h2>
        {candidates.length === 0 ? <p className="text-gray-500">No applications yet</p> : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidates.slice(0, 5).map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{c.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-500">{c.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-500">{new Date(c.applied_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${c.status === 'Applied' ? 'bg-blue-100 text-blue-800' : c.status === 'Selected' ? 'bg-green-100 text-green-800' : c.status === 'Interview' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'}`}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Postings</h2>
        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900">No job postings yet</h3>
            <Link to="/jobs/create" className="mt-4 inline-block px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Create Job</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{jobs.map((job) => <JobCard key={job.id} job={job} isHR={true} />)}</div>
        )}
      </div>
    </div>
  )
}

export default HRDashboard
