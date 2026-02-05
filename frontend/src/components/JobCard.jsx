import { Link } from 'react-router-dom'

function JobCard({ job, isHR = false }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800'
      case 'Closed': return 'bg-red-100 text-red-800'
      case 'On Hold': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-t-4 border-kite-blue">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-kite-blue">{job.job_title}</h3>
          <p className="text-gray-600">{job.department}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>{job.status}</span>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {job.location}
        </div>
        <div className="flex items-center text-gray-600">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {job.salary}
        </div>
        <div className="flex items-center text-gray-600">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {job.experience}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.slice(0, 4).map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-kite-light text-kite-blue rounded text-sm">{skill}</span>
        ))}
        {job.skills.length > 4 && <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">+{job.skills.length - 4} more</span>}
      </div>
      <div className="flex justify-between items-center pt-4 border-t">
        <span className="text-sm text-gray-500">Posted {new Date(job.created_at).toLocaleDateString()}</span>
        <div className="flex space-x-2">
          {isHR ? (
            <>
              <Link to={`/hr/candidates/${job.id}`} className="px-4 py-2 bg-kite-blue text-white rounded-md text-sm font-medium hover:bg-primary-700">View Candidates</Link>
              <Link to={`/jobs/${job.id}`} className="px-4 py-2 border border-kite-blue text-kite-blue rounded-md text-sm font-medium hover:bg-kite-light">Edit</Link>
            </>
          ) : (
            <>
              <Link to={`/jobs/${job.id}`} className="px-4 py-2 border border-kite-blue text-kite-blue rounded-md text-sm font-medium hover:bg-kite-light">View Details</Link>
              {job.status === 'Open' && <Link to={`/apply/${job.id}`} className="px-4 py-2 bg-kite-blue text-white rounded-md text-sm font-medium hover:bg-primary-700">Apply Now</Link>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobCard
