import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { caseCycleService } from '@/services'
import type { CaseCycleSearchParams, CreateCaseCycleInput, CloseCaseCycleInput } from '@/types'

export function useCaseCycles(params?: CaseCycleSearchParams) {
  return useQuery({
    queryKey: ['caseCycles', params],
    queryFn: () => caseCycleService.getCycles(params),
    placeholderData: keepPreviousData,
  })
}

export function useActiveCycle() {
  return useQuery({
    queryKey: ['caseCycles', 'active'],
    queryFn: () => caseCycleService.getActiveCycle(),
  })
}

export function useCaseCycle(id: string) {
  return useQuery({
    queryKey: ['caseCycles', id],
    queryFn: () => caseCycleService.getCycle(id),
    enabled: id.length > 0,
  })
}

export function useOrphanedCaseStats() {
  return useQuery({
    queryKey: ['caseCycles', 'orphaned-stats'],
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
