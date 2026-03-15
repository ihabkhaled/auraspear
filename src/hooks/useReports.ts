import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { reportService } from '@/services'
import { useTenantStore } from '@/stores'
import type { ReportSearchParams } from '@/types'

export function useReports(params?: ReportSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['reports', tenantId, params],
    queryFn: () => reportService.getReports(params),
    placeholderData: keepPreviousData,
  })
}

export function useReportStats() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['reports', 'stats', tenantId],
    queryFn: () => reportService.getStats(),
  })
}

export function useCreateReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => reportService.createReport(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })
}

export function useUpdateReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      reportService.updateReport(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })
}

export function useDeleteReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => reportService.deleteReport(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })
}
