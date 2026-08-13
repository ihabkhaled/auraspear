import api from '@/lib/api'
import { extractApiData } from '@/lib/utils'
import type { AiHandoffHistoryItem, AiHandoffPromoteResult, AiHandoffStats } from '@/types'

export const aiHandoffService = {
  promote: (data: {
    findingId: string
    targetModule: string
    title?: string
    description?: string
  }) => api.post('/ai-handoffs/promote', data).then(r => extractApiData<AiHandoffPromoteResult>(r)),

  getHistory: (params?: Record<string, string | number>) =>
    api.get('/ai-handoffs/history', { params }).then(r => {
      const body = r.data as { data: AiHandoffHistoryItem[]; total: number }
      return { data: Array.isArray(body.data) ? body.data : [], total: Number(body.total ?? 0) }
    }),

  getStats: () => api.get('/ai-handoffs/stats').then(r => extractApiData<AiHandoffStats>(r)),

  getFindingLinks: (findingId: string) =>
    api.get(`/ai-handoffs/findings/${findingId}/links`).then(r => extractApiData<unknown[]>(r)),
}
