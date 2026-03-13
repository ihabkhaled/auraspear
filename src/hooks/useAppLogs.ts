import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { adminService } from '@/services'
import type { AppLogSearchParams } from '@/types'

export function useAppLogs(params?: AppLogSearchParams) {
  return useQuery({
    queryKey: ['app-logs', params],
    queryFn: () => adminService.getAppLogs(params),
    placeholderData: keepPreviousData,
  })
}

export function useAppLogDetail(id: string | null) {
  return useQuery({
    queryKey: ['app-log', id],
    queryFn: () => adminService.getAppLogById(id as string),
    enabled: Boolean(id),
  })
}
