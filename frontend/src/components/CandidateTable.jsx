import { useState } from 'react'
import toast from 'react-hot-toast'
import { candidateApi } from '../services/api'

const STATUS_OPTIONS = [
  { value: 'Applied', color: 'bg-blue-100 text-blue-800' },
  { value: 'Shortlisted', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Interview', color: 'bg-purple-100 text-purple-800' },
  { value: 'Selected', color: 'bg-green-100 text-green-800' },
  { value: 'Rejected', color: 'bg-red-100 text-red-800' },
]

function CandidateTable({ candidates, onStatusUpdate }) {
  const [updatingId, setUpdatingId] = useState(null)
  const getStatusColor = (status) => STATUS_OPTIONS.find((s) => s.value === status)?.color || 'bg-gray-100 text-gray-800'

  const handleStatusChange = async (candidateId, newStatus) => {
    setUpdatingId(candidateId)
    try {
      await candidateApi.updateStatus(candidateId, newStatus)
      toast.success(`Status updated to ${newStatus}`)
      if (onStatusUpdate) onStatusUpdate()
    } catch (error) {
      toast.error('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  if (candidates.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No candidates yet</h3>
        <p className="mt-2 text-gray-500">No applications have been received for this job.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resume</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-medium">{candidate.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="ml-4 text-sm font-medium text-gray-900">{candidate.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{candidate.email}</div>
                  <div className="text-sm text-gray-500">{candidate.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {candidate.resume_filename ? <span className="text-sm text-primary-600">📄 {candidate.resume_filename}</span> : <span className="text-sm text-gray-400">No resume</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(candidate.applied_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(candidate.status)}`}>{candidate.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <select value={candidate.status} onChange={(e) => handleStatusChange(candidate.id, e.target.value)} disabled={updatingId === candidate.id} className="block w-full px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50">
                    {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.value}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CandidateTable
