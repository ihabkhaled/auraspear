import { useQuery } from '@tanstack/react-query'
import { POLLING_INTERVAL } from '@/lib/constants'
import { dashboardService } from '@/services'
import { useTenantStore } from '@/stores'

export function useKPIs() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['dashboard', tenantId, 'kpis'],
    queryFn: () => dashboardService.getKPIs(),
    refetchInterval: POLLING_INTERVAL,
  })
}

export function useAlertTrends() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['dashboard', tenantId, 'alert-trends'],
    queryFn: () => dashboardService.getAlertTrends(),
  })
}

export function useMITREStats() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['dashboard', tenantId, 'mitre-stats'],
    queryFn: () => dashboardService.getMITREStats(),
  })
}

export function useAssetRisks() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['dashboard', tenantId, 'asset-risks'],
    queryFn: () => dashboardService.getAssetRisks(),
  })
}

export function usePipelineHealth() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['dashboard', tenantId, 'pipeline-health'],
    queryFn: () => dashboardService.getPipelineHealth(),
    refetchInterval: POLLING_INTERVAL,
  })
}
