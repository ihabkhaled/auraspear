import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { correlationService } from '@/services'
import { useTenantStore } from '@/stores'
import type { CorrelationSearchParams } from '@/types'

export function useCorrelationRules(params?: CorrelationSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['correlation', tenantId, params],
    queryFn: () => correlationService.getRules(params),
  })
}

export function useCorrelationStats() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['correlation-stats', tenantId],
    queryFn: () => correlationService.getCorrelationStats(),
  })
}

export function useCreateRule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => correlationService.createRule(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['correlation'] })
      void queryClient.invalidateQueries({ queryKey: ['correlation-stats'] })
    },
  })
}

export function useUpdateRule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      correlationService.updateRule(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['correlation'] })
      void queryClient.invalidateQueries({ queryKey: ['correlation-stats'] })
    },
  })
}

export function useDeleteRule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => correlationService.deleteRule(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['correlation'] })
      void queryClient.invalidateQueries({ queryKey: ['correlation-stats'] })
    },
  })
}
