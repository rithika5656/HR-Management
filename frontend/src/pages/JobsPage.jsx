import { useState, useEffect } from 'react'
import { jobApi } from '../services/api'
import JobCard from '../components/JobCard'

function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')

  useEffect(() => { fetchJobs() }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await jobApi.getAll()
      setJobs(response.data)
    } catch (err) {
      setError('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const departments = [...new Set(jobs.map((job) => job.department))]
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) || job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch && (!filterDepartment || job.department === filterDepartment)
  })

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div></div>
  if (error) return <div className="text-center py-12"><p className="text-red-600">{error}</p><button onClick={fetchJobs} className="mt-4 px-4 py-2 bg-kite-blue text-white rounded-md">Retry</button></div>

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-kite-blue mb-2">Job Openings</h1>
        <p className="text-gray-600">Find your next opportunity at KITE</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 border-t-4 border-kite-blue">
        <div className="flex flex-col md:flex-row gap-4">
          <input type="text" placeholder="Search by job title or skill..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kite-blue focus:border-kite-blue" />
          <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kite-blue">
            <option value="">All Departments</option>
            {departments.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
          </select>
        </div>
      </div>
      <p className="text-gray-600 mb-4">Showing {filteredJobs.length} of {jobs.length} jobs</p>
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-kite-blue">No jobs found</h3>
          <p className="mt-2 text-gray-500">Try adjusting your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{filteredJobs.map((job) => <JobCard key={job.id} job={job} isHR={false} />)}</div>
      )}
    </div>
  )
}

export default JobsPage
