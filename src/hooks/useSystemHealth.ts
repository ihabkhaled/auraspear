import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { systemHealthService } from '@/services'
import { useTenantStore } from '@/stores'
import type { HealthCheckSearchParams, MetricSearchParams } from '@/types'

const HEALTH_POLL_INTERVAL = 30_000

export function useHealthChecks(params?: HealthCheckSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['system-health', 'checks', tenantId, params],
    queryFn: () => systemHealthService.listHealthChecks(params),
    placeholderData: keepPreviousData,
    refetchInterval: HEALTH_POLL_INTERVAL,
  })
}

export function useLatestHealthChecks() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['system-health', 'checks', 'latest', tenantId],
    queryFn: () => systemHealthService.getLatestChecks(),
    refetchInterval: HEALTH_POLL_INTERVAL,
  })
}

export function useSystemMetrics(params?: MetricSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['system-health', 'metrics', tenantId, params],
    queryFn: () => systemHealthService.listMetrics(params),
    placeholderData: keepPreviousData,
    refetchInterval: HEALTH_POLL_INTERVAL,
  })
}

export function useSystemHealthStats() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['system-health', 'stats', tenantId],
    queryFn: () => systemHealthService.getStats(),
    refetchInterval: HEALTH_POLL_INTERVAL,
  })
}
