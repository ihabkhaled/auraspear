import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { systemHealthService } from '@/services'
import { useTenantStore } from '@/stores'
import type { HealthCheckSearchParams, MetricSearchParams } from '@/types'

export function useHealthChecks(params?: HealthCheckSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['system-health', 'checks', tenantId, params],
    queryFn: () => systemHealthService.listHealthChecks(params),
    placeholderData: keepPreviousData,
  })
}

export function useLatestHealthChecks() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['system-health', 'checks', 'latest', tenantId],
    queryFn: () => systemHealthService.getLatestChecks(),
  })
}

export function useSystemMetrics(params?: MetricSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['system-health', 'metrics', tenantId, params],
    queryFn: () => systemHealthService.listMetrics(params),
    placeholderData: keepPreviousData,
  })
}

export function useSystemHealthStats() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['system-health', 'stats', tenantId],
    queryFn: () => systemHealthService.getStats(),
  })
}

export function useCreateHealthCheck() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => systemHealthService.createHealthCheck(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['system-health'] })
    },
  })
}

export function useUpdateHealthCheck() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      systemHealthService.updateHealthCheck(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['system-health'] })
    },
  })
}

export function useDeleteHealthCheck() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => systemHealthService.deleteHealthCheck(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['system-health'] })
    },
  })
}
