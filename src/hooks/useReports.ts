import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { Permission } from '@/enums'
import { requirePermission } from '@/lib/permissions'
import { reportService } from '@/services'
import { useAuthStore, useTenantStore } from '@/stores'
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
  const permissions = useAuthStore(s => s.permissions)
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => {
      requirePermission(permissions, Permission.REPORTS_CREATE)
      return reportService.createReport(data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reports', tenantId] })
    },
  })
}

export function useUpdateReport() {
  const queryClient = useQueryClient()
  const permissions = useAuthStore(s => s.permissions)
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      requirePermission(permissions, Permission.REPORTS_CREATE)
      return reportService.updateReport(id, data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reports', tenantId] })
    },
  })
}

export function useDeleteReport() {
  const queryClient = useQueryClient()
  const permissions = useAuthStore(s => s.permissions)
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useMutation({
    mutationFn: (id: string) => {
      requirePermission(permissions, Permission.REPORTS_DELETE)
      return reportService.deleteReport(id)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reports', tenantId] })
    },
  })
}
