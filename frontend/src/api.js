const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

async function request(path, options = {}) {
  const token = localStorage.getItem('accessToken')
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

export const api = {
  login: (payload) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getStats: () => request('/api/dashboard/stats'),
  getActivity: () => request('/api/dashboard/activity'),
  getReviews: (params = {}) => {
    const qs = new URLSearchParams(params)
    return request(`/api/reviews${qs.toString() ? `?${qs.toString()}` : ''}`)
  },
  getReview: (id) => request(`/api/reviews/${id}`),
  createReview: (payload) => request('/api/reviews', { method: 'POST', body: JSON.stringify(payload) }),
  createAiDraft: (payload) => request('/api/reviews/ai-draft', { method: 'POST', body: JSON.stringify(payload) }),
  respondToReview: (id, payload) => request(`/api/reviews/${id}/respond`, { method: 'POST', body: JSON.stringify(payload) }),
  getRequests: () => request('/api/review-requests'),
  createRequest: (payload) => request('/api/review-requests', { method: 'POST', body: JSON.stringify(payload) }),
  getFeedback: () => request('/api/nps'),
  createFeedback: (payload) => request('/api/nps', { method: 'POST', body: JSON.stringify(payload) }),
  getSettings: () => request('/api/settings'),
  updateSettings: (payload) => request('/api/settings', { method: 'PUT', body: JSON.stringify(payload) }),
}
