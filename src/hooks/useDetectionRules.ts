import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { detectionRuleService } from '@/services'
import { useTenantStore } from '@/stores'
import type { DetectionRuleSearchParams } from '@/types'

export function useDetectionRules(params?: DetectionRuleSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['detection-rules', tenantId, params],
    queryFn: () => detectionRuleService.listRules(params),
    placeholderData: keepPreviousData,
  })
}

export function useDetectionRuleStats() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['detection-rules', 'stats', tenantId],
    queryFn: () => detectionRuleService.getStats(),
  })
}

export function useCreateDetectionRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => detectionRuleService.createRule(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['detection-rules'] })
    },
  })
}

export function useUpdateDetectionRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      detectionRuleService.updateRule(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['detection-rules'] })
    },
  })
}

export function useDeleteDetectionRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => detectionRuleService.deleteRule(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['detection-rules'] })
    },
  })
}
