import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Job APIs
export const jobApi = {
  getAll: (statusFilter = null) => {
    const params = statusFilter ? { status_filter: statusFilter } : {}
    return api.get('/jobs/', { params })
  },
  getOpen: () => api.get('/jobs/open'),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (jobData) => api.post('/jobs/', jobData),
  update: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  delete: (id) => api.delete(`/jobs/${id}`),
}

// Candidate APIs
export const candidateApi = {
  apply: (formData) => api.post('/apply', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getByJob: (jobId) => api.get(`/candidates/${jobId}`),
  getAll: () => api.get('/candidates'),
  getById: (id) => api.get(`/candidate/${id}`),
  updateStatus: (candidateId, status) => 
    api.put(`/candidate/status/${candidateId}`, { status }),
  downloadResume: (candidateId) => 
    `${API_BASE_URL}/resume/${candidateId}`,
  getDashboardStats: () => api.get('/dashboard/stats'),
}

export default api
