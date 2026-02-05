import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { jobApi } from '../services/api'

function JobForm({ initialData = null, isEditing = false }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    job_title: initialData?.job_title || '',
    department: initialData?.department || '',
    skills: initialData?.skills?.join(', ') || '',
    experience: initialData?.experience || '',
    salary: initialData?.salary || '',
    location: initialData?.location || '',
    status: initialData?.status || 'Open',
  })

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const jobData = { ...formData, skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean) }
      if (isEditing && initialData?.id) {
        await jobApi.update(initialData.id, jobData)
        toast.success('Job updated successfully!')
      } else {
        await jobApi.create(jobData)
        toast.success('Job posted successfully!')
      }
      navigate('/hr/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border-t-4 border-kite-blue">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-kite-blue mb-2">Job Title *</label>
          <input type="text" name="job_title" value={formData.job_title} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500" placeholder="e.g., Senior Software Engineer" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
          <input type="text" name="department" value={formData.department} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500" placeholder="e.g., Engineering" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills * (comma-separated)</label>
          <input type="text" name="skills" value={formData.skills} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500" placeholder="e.g., React, Node.js, MongoDB" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience Required *</label>
          <input type="text" name="experience" value={formData.experience} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500" placeholder="e.g., 3-5 years" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range *</label>
          <input type="text" name="salary" value={formData.salary} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500" placeholder="e.g., $80,000 - $120,000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500" placeholder="e.g., New York, NY" />
        </div>
        {isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500">
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 border border-kite-blue text-kite-blue rounded-md hover:bg-kite-light">Cancel</button>
        <button type="submit" disabled={loading} className="px-6 py-2 bg-kite-blue text-white rounded-md hover:bg-primary-700 disabled:opacity-50">{loading ? 'Saving...' : isEditing ? 'Update Job' : 'Post Job'}</button>
      </div>
    </form>
  )
}

export default JobForm
