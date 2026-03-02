import api from '@/lib/api'
import type { ApiResponse, HuntSession, HuntMessage, HuntEvent } from '@/types'

export const huntService = {
  createSession: (data: { query: string; timeRange: string }) =>
    api.post<ApiResponse<HuntSession>>('/hunt/sessions', data).then(r => r.data),

  sendMessage: (sessionId: string, content: string) =>
    api
      .post<ApiResponse<HuntMessage>>(`/hunt/sessions/${sessionId}/messages`, { content })
      .then(r => r.data),

  getEvents: (sessionId: string) =>
    api.get<ApiResponse<HuntEvent[]>>(`/hunt/sessions/${sessionId}/events`).then(r => r.data),
}
