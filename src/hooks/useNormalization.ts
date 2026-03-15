import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { normalizationService } from '@/services'
import { useTenantStore } from '@/stores'
import type { NormalizationSearchParams } from '@/types'

export function useNormalizationPipelines(params?: NormalizationSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['normalization', 'pipelines', tenantId, params],
    queryFn: () => normalizationService.listPipelines(params),
    placeholderData: keepPreviousData,
  })
}

export function useNormalizationStats() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['normalization', 'stats', tenantId],
    queryFn: () => normalizationService.getStats(),
  })
}

export function useCreatePipeline() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => normalizationService.createPipeline(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['normalization'] })
    },
  })
}

export function useUpdatePipeline() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      normalizationService.updatePipeline(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['normalization'] })
    },
  })
}

export function useDeletePipeline() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => normalizationService.deletePipeline(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['normalization'] })
    },
  })
}
