import api from '@/lib/api'
import { extractApiData } from '@/lib/utils'
import type { RagStats, RagTraceResult } from '@/types'

export const aiRagService = {
  trace: (query: string) =>
    api.get('/rag/trace', { params: { query } }).then(r => extractApiData<RagTraceResult>(r)),

  getStats: () => api.get('/rag/stats').then(r => extractApiData<RagStats>(r)),
}
