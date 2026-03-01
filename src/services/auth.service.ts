import api from '@/lib/api'
import type { AuthUser, LoginResponse, RefreshResponse } from '@/types'

export const authService = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }).then(r => r.data),

  refresh: (refreshToken: string) =>
    api.post<RefreshResponse>('/auth/refresh', { refreshToken }).then(r => r.data),

  getMe: () => api.get<AuthUser>('/auth/me').then(r => r.data),

  logout: () => api.post('/auth/logout').then(r => r.data),
}
