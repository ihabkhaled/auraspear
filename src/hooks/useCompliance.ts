import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { complianceService } from '@/services'
import { useTenantStore } from '@/stores'
import type { ComplianceSearchParams } from '@/types'

export function useComplianceFrameworks(params?: ComplianceSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['compliance', 'frameworks', tenantId, params],
    queryFn: () => complianceService.getFrameworks(params),
    placeholderData: keepPreviousData,
  })
}

export function useComplianceStats() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['compliance', 'stats', tenantId],
    queryFn: () => complianceService.getStats(),
  })
}

export function useCreateFramework() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => complianceService.createFramework(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['compliance'] })
    },
  })
}

export function useUpdateFramework() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      complianceService.updateFramework(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['compliance'] })
    },
  })
}

export function useDeleteFramework() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => complianceService.deleteFramework(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['compliance'] })
    },
  })
}

export function useComplianceControls(frameworkId: string | null) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['compliance', 'controls', tenantId, frameworkId],
    queryFn: () => complianceService.getControls(frameworkId ?? ''),
    enabled: frameworkId !== null && frameworkId.length > 0,
  })
}

export function useUpdateControl() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      frameworkId,
      controlId,
      data,
    }: {
      frameworkId: string
      controlId: string
      data: Record<string, unknown>
    }) => complianceService.updateControl(frameworkId, controlId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['compliance'] })
    },
  })
}
