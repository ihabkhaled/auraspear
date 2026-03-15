import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { uebaService } from '@/services'
import { useTenantStore } from '@/stores'
import type { UebaEntitySearchParams, UebaAnomalySearchParams, MlModelSearchParams } from '@/types'

export function useUebaEntities(params?: UebaEntitySearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['ueba', 'entities', tenantId, params],
    queryFn: () => uebaService.getEntities(params),
    placeholderData: keepPreviousData,
  })
}

export function useUebaEntity(id: string | null) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['ueba', 'entity', tenantId, id],
    queryFn: () => uebaService.getEntityById(id ?? ''),
    enabled: id !== null && id.length > 0,
  })
}

export function useUebaAnomalies(params?: UebaAnomalySearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['ueba', 'anomalies', tenantId, params],
    queryFn: () => uebaService.getAnomalies(params),
    placeholderData: keepPreviousData,
  })
}

export function useMlModels(params?: MlModelSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['ueba', 'models', tenantId, params],
    queryFn: () => uebaService.getModels(params),
    placeholderData: keepPreviousData,
  })
}

export function useUebaStats() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['ueba', 'stats', tenantId],
    queryFn: () => uebaService.getStats(),
  })
}

export function useCreateUebaEntity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => uebaService.createEntity(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ueba', 'entities'] })
      void queryClient.invalidateQueries({ queryKey: ['ueba', 'stats'] })
    },
  })
}

export function useUpdateUebaEntity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      uebaService.updateEntity(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ueba', 'entities'] })
      void queryClient.invalidateQueries({ queryKey: ['ueba', 'entity'] })
      void queryClient.invalidateQueries({ queryKey: ['ueba', 'stats'] })
    },
  })
}

export function useDeleteUebaEntity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => uebaService.deleteEntity(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ueba', 'entities'] })
      void queryClient.invalidateQueries({ queryKey: ['ueba', 'stats'] })
    },
  })
}

export function useResolveAnomaly() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => uebaService.resolveAnomaly(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ueba', 'anomalies'] })
      void queryClient.invalidateQueries({ queryKey: ['ueba', 'entity'] })
      void queryClient.invalidateQueries({ queryKey: ['ueba', 'stats'] })
    },
  })
}
