import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { AUTH_STORAGE_KEY, TENANT_STORAGE_KEY } from '@/lib/constants/storage'
import type { AuthStorageState, RefreshResponse, TenantStorageState } from '@/types'

const API_BASE_URL = process.env['NEXT_PUBLIC_API_URL'] ?? '/api'

/** Timeout for token refresh requests (10 seconds) */
const REFRESH_TIMEOUT_MS = 10_000

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean
}

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: InternalAxiosRequestConfig) => void
  reject: (error: unknown) => void
  config: InternalAxiosRequestConfig
}> = []

function getAuthState(): { accessToken: string; refreshToken: string; tenantId: string } {
  const empty = { accessToken: '', refreshToken: '', tenantId: '' }

  if (typeof window === 'undefined') return empty

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return empty

    const parsed = JSON.parse(raw) as AuthStorageState
    const accessToken = parsed.state?.accessToken ?? ''
    const refreshToken = parsed.state?.refreshToken ?? ''
    const authTenantId = parsed.state?.user?.tenantId ?? ''

    // Check tenant switcher store for overridden tenant ID (used by GLOBAL_ADMIN)
    let tenantId = authTenantId
    try {
      const tenantRaw = localStorage.getItem(TENANT_STORAGE_KEY)
      if (tenantRaw) {
        const tenantParsed = JSON.parse(tenantRaw) as TenantStorageState
        const switchedTenantId = tenantParsed.state?.currentTenantId
        if (switchedTenantId) {
          tenantId = switchedTenantId
        }
      }
    } catch {
      // tenant storage corrupted — use auth tenant
    }

    return { accessToken, refreshToken, tenantId }
  } catch {
    return empty
  }
}

/**
 * Updates tokens in both localStorage AND Zustand store to prevent stale state.
 * The Zustand persist middleware will pick up the localStorage change,
 * but we also trigger a storage event to ensure cross-tab sync.
 */
function updateStoredTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return

  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return

  try {
    const parsed = JSON.parse(raw) as AuthStorageState
    if (parsed.state) {
      parsed.state.accessToken = accessToken
      parsed.state.refreshToken = refreshToken
      parsed.state.isAuthenticated = true
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(parsed))

      // Dispatch a storage event so Zustand's persist middleware re-syncs.
      // This ensures the in-memory store picks up the new tokens immediately.
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: AUTH_STORAGE_KEY,
          newValue: JSON.stringify(parsed),
        })
      )
    }
  } catch {
    // storage corrupted — will be cleared on redirect
  }
}

function clearAuthAndRedirect(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(TENANT_STORAGE_KEY)
  window.location.href = '/login'
}

function processQueue(error: unknown, newAccessToken?: string): void {
  for (const item of failedQueue) {
    if (error) {
      item.reject(error)
    } else if (newAccessToken) {
      item.config.headers['Authorization'] = `Bearer ${newAccessToken}`
      item.resolve(item.config)
    }
  }
  failedQueue = []
}

function isAuthRoute(url?: string): boolean {
  if (!url) return false
  return url.includes('/auth/refresh') || url.includes('/auth/login')
}

async function attemptTokenRefresh(originalRequest: RetryableRequest): Promise<RetryableRequest> {
  originalRequest._retry = true
  isRefreshing = true

  const { refreshToken } = getAuthState()

  if (!refreshToken) {
    isRefreshing = false
    clearAuthAndRedirect()
    throw new Error('No refresh token available')
  }

  try {
    const response = await axios.post<RefreshResponse>(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: REFRESH_TIMEOUT_MS,
      }
    )

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data
    updateStoredTokens(newAccessToken, newRefreshToken)

    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
    processQueue(null, newAccessToken)
    return originalRequest
  } catch (refreshError) {
    processQueue(refreshError)
    clearAuthAndRedirect()
    throw refreshError
  } finally {
    isRefreshing = false
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

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

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined

    if (!originalRequest || error.response?.status !== 401) {
      throw error
    }

    if (originalRequest._retry) {
      clearAuthAndRedirect()
      throw error
    }

    if (isAuthRoute(originalRequest.url)) {
      throw error
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest })
      }).then(config => api(config as InternalAxiosRequestConfig))
    }

    const refreshedConfig = await attemptTokenRefresh(originalRequest)
    return api(refreshedConfig)
  }
)

export default api
