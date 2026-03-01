import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { RefreshResponse } from '@/types'

const api = axios.create({
  baseURL: process.env['NEXT_PUBLIC_API_URL'] ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

function getAuthState(): { accessToken: string; refreshToken: string; tenantId: string } {
  if (typeof window === 'undefined') {
    return { accessToken: '', refreshToken: '', tenantId: '' }
  }

  try {
    const raw = localStorage.getItem('auth-storage')
    if (!raw) {
      return { accessToken: '', refreshToken: '', tenantId: '' }
    }
    const parsed = JSON.parse(raw) as {
      state?: { accessToken?: string; refreshToken?: string; user?: { tenantId?: string } }
    }
    return {
      accessToken: parsed.state?.accessToken ?? '',
      refreshToken: parsed.state?.refreshToken ?? '',
      tenantId: parsed.state?.user?.tenantId ?? '',
    }
  } catch {
    return { accessToken: '', refreshToken: '', tenantId: '' }
  }
}

api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const { accessToken, tenantId } = getAuthState()

    if (tenantId) {
      config.headers['X-Tenant-Id'] = tenantId
    }

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
  }
  return config
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: InternalAxiosRequestConfig) => void
  reject: (error: unknown) => void
  config: InternalAxiosRequestConfig
}> = []

function processQueue(error: unknown): void {
  for (const item of failedQueue) {
    if (error) {
      item.reject(error)
    } else {
      const { accessToken } = getAuthState()
      item.config.headers['Authorization'] = `Bearer ${accessToken}`
      item.resolve(item.config)
    }
  }
  failedQueue = []
}

function clearAuthAndRedirect(): void {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.removeItem('auth-storage')
  window.location.href = '/login'
}

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config

    if (!originalRequest || error.response?.status !== 401) {
      throw error
    }

    if ((originalRequest as InternalAxiosRequestConfig & { _retry?: boolean })._retry) {
      clearAuthAndRedirect()
      throw error
    }

    if (
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/login')
    ) {
      throw error
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest })
      }).then(config => api(config as InternalAxiosRequestConfig))
    }

    isRefreshing = true
    ;(originalRequest as InternalAxiosRequestConfig & { _retry?: boolean })._retry = true

    const { refreshToken } = getAuthState()

    if (!refreshToken) {
      isRefreshing = false
      clearAuthAndRedirect()
      throw error
    }

    try {
      const response = await axios.post<RefreshResponse>(
        `${api.defaults.baseURL}/auth/refresh`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      )

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data

      const raw = localStorage.getItem('auth-storage')
      if (raw) {
        const parsed = JSON.parse(raw) as { state?: Record<string, unknown> }
        if (parsed.state) {
          parsed.state['accessToken'] = newAccessToken
          parsed.state['refreshToken'] = newRefreshToken
          parsed.state['isAuthenticated'] = true
          localStorage.setItem('auth-storage', JSON.stringify(parsed))
        }
      }

      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
      processQueue(null)
      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError)
      clearAuthAndRedirect()
      throw refreshError
    } finally {
      isRefreshing = false
    }
  }
)

export default api
