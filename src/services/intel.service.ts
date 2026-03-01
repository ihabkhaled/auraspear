import api from '@/lib/api'
import type { ApiResponse, MISPEvent, IOCCorrelation } from '@/types'

interface MISPSearchParams {
  page?: number
  limit?: number
  query?: string
  threatLevel?: string
}

export const intelService = {
  getMISPEvents: (params?: MISPSearchParams) =>
    api.get<ApiResponse<MISPEvent[]>>('/intel/misp-events', { params }).then(r => r.data),

  searchIOC: (query: string, type: string) =>
    api
      .get<ApiResponse<IOCCorrelation[]>>('/intel/ioc-search', { params: { query, type } })
      .then(r => r.data),

  getCorrelations: () =>
    api.get<ApiResponse<IOCCorrelation[]>>('/intel/correlations').then(r => r.data),
}
