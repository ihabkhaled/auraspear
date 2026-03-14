import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { caseCycleService } from '@/services'
import { useTenantStore } from '@/stores'
import type { CaseCycleSearchParams, CreateCaseCycleInput, CloseCaseCycleInput } from '@/types'

export function useCaseCycles(params?: CaseCycleSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['caseCycles', tenantId, params],
    queryFn: () => caseCycleService.getCycles(params),
    placeholderData: keepPreviousData,
  })
}

export function useActiveCycle() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['caseCycles', tenantId, 'active'],
    queryFn: () => caseCycleService.getActiveCycle(),
  })
}

export function useCaseCycle(id: string) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['caseCycles', tenantId, id],
    queryFn: () => caseCycleService.getCycle(id),
    enabled: id.length > 0,
  })
}

export function useOrphanedCaseStats() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['caseCycles', tenantId, 'orphaned-stats'],
    queryFn: () => caseCycleService.getOrphanedStats(),
  })
}

export function useCreateCaseCycle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCaseCycleInput) => caseCycleService.createCycle(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['caseCycles'] })
    },
  })
}

export function useCloseCaseCycle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CloseCaseCycleInput }) =>
      caseCycleService.closeCycle(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['caseCycles'] })
    },
  })
}

export function useUpdateCaseCycle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCaseCycleInput> }) =>
      caseCycleService.updateCycle(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['caseCycles'] })
    },
  })
}

export function useActivateCaseCycle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => caseCycleService.activateCycle(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['caseCycles'] })
    },
  })
}

export function useDeleteCaseCycle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => caseCycleService.deleteCycle(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['caseCycles'] })
    },
  })
}
