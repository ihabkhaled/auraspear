import { useQuery } from '@tanstack/react-query'
import type { SortOrder } from '@/enums'
import { intelService } from '@/services'
import type { MISPSearchParams } from '@/types'

export function useIntelStats() {
  return useQuery({
    queryKey: ['intel', 'stats'],
    queryFn: () => intelService.getStats(),
  })
}

export function useMISPEvents(params?: MISPSearchParams) {
  return useQuery({
    queryKey: ['intel', 'misp', params],
    queryFn: () => intelService.getMISPEvents(params),
  })
}

export function useIOCSearch(
  query: string,
  type: string,
  page = 1,
  limit = 10,
  sortBy?: string,
  sortOrder?: SortOrder,
  source?: string
) {
  return useQuery({
    queryKey: ['intel', 'ioc', query, type, source, page, limit, sortBy, sortOrder],
    queryFn: () => intelService.searchIOC(query, type, page, limit, sortBy, sortOrder, source),
  })
}
