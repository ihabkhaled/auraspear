import api from '@/lib/api'
import type { ApiResponse, IOCCorrelation, MISPEvent, MISPSearchParams } from '@/types'

export const intelService = {
  getMISPEvents: (params?: MISPSearchParams) =>
    api.get<ApiResponse<MISPEvent[]>>('/intel/misp-events', { params }).then(r => r.data),

  searchIOC: (
    query: string,
    type: string,
    page = 1,
    limit = 10,
    sortBy?: string,
    sortOrder?: string,
    source?: string
  ) =>
    api
      .get<ApiResponse<IOCCorrelation[]>>('/intel/ioc-search', {
        params: { q: query, type, source, page, limit, sortBy, sortOrder },
      })
      .then(r => r.data),
}
