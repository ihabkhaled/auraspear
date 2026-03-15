import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { vulnerabilityService } from '@/services'
import { useTenantStore } from '@/stores'
import type { VulnerabilitySearchParams } from '@/types'

export function useVulnerabilities(params?: VulnerabilitySearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['vulnerabilities', tenantId, params],
    queryFn: () => vulnerabilityService.getVulnerabilities(params),
  })
}

export function useVulnerabilityStats() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['vulnerability-stats', tenantId],
    queryFn: () => vulnerabilityService.getVulnerabilityStats(),
  })
}

export function useCreateVulnerability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => vulnerabilityService.createVulnerability(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['vulnerabilities'] })
      void queryClient.invalidateQueries({ queryKey: ['vulnerability-stats'] })
    },
  })
}

export function useUpdateVulnerability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      vulnerabilityService.updateVulnerability(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['vulnerabilities'] })
      void queryClient.invalidateQueries({ queryKey: ['vulnerability-stats'] })
    },
  })
}

export function useDeleteVulnerability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => vulnerabilityService.deleteVulnerability(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['vulnerabilities'] })
      void queryClient.invalidateQueries({ queryKey: ['vulnerability-stats'] })
    },
  })
}
