import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { candidateApi } from '../services/api'

function ApplicationForm({ jobId, jobTitle }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [resume, setResume] = useState(null)

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) { toast.error('Please upload a PDF or DOC file'); e.target.value = ''; return }
      if (file.size > 5 * 1024 * 1024) { toast.error('File size must be less than 5MB'); e.target.value = ''; return }
      setResume(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!resume) { toast.error('Please upload your resume'); return }
    setLoading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('job_id', jobId)
      formDataToSend.append('resume', resume)
      await candidateApi.apply(formDataToSend)
      toast.success('Application submitted successfully!')
      navigate('/jobs')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border-t-4 border-kite-blue">
      <div className="mb-6 pb-4 border-b">
        <h3 className="text-lg font-medium text-kite-blue">Applying for:</h3>
        <p className="text-kite-blue font-semibold">{jobTitle}</p>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500" placeholder="Enter your full name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500" placeholder="Enter your email" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500" placeholder="Enter your phone number" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Resume * (PDF or DOC, max 5MB)</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary-400">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                  <span>Upload a file</span>
                  <input type="file" name="resume" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="sr-only" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF, DOC up to 5MB</p>
              {resume && <p className="text-sm text-green-600 font-medium">✓ {resume.name}</p>}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 border border-kite-blue text-kite-blue rounded-md hover:bg-kite-light">Cancel</button>
        <button type="submit" disabled={loading} className="px-6 py-2 bg-kite-blue text-white rounded-md hover:bg-primary-700 disabled:opacity-50">{loading ? 'Submitting...' : 'Submit Application'}</button>
      </div>
    </form>
  )
}

export default ApplicationForm
