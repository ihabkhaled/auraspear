import axios from 'axios'

const api = axios.create({
  baseURL: process.env['NEXT_PUBLIC_API_URL'] ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(config => {
  if (typeof window === 'undefined') {
    config.headers['X-Tenant-Id'] = 'tenant-1'
  } else {
    const tenantId = localStorage.getItem('currentTenantId') ?? 'tenant-1'
    config.headers['X-Tenant-Id'] = tenantId

    const token = localStorage.getItem('auth-token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
