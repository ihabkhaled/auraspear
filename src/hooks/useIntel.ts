import { useQuery } from '@tanstack/react-query'
import { intelService } from '@/services'
import type { MISPSearchParams } from '@/types'

export function useMISPEvents(params?: MISPSearchParams) {
  return useQuery({
    queryKey: ['intel', 'misp', params],
    queryFn: () => intelService.getMISPEvents(params),
  })
}

export function useIOCSearch(query: string, type: string) {
  return useQuery({
    queryKey: ['intel', 'ioc', query, type],
    queryFn: () => intelService.searchIOC(query, type),
    enabled: query.length > 0,
  })
}

export function useCorrelations() {
  return useQuery({
    queryKey: ['intel', 'correlations'],
    queryFn: () => intelService.getCorrelations(),
  })
}
