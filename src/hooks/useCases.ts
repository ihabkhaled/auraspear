import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { caseService } from '@/services'
import type { CaseSearchParams, CreateCaseInput, UpdateCaseInput } from '@/types'

export function useCases(params?: CaseSearchParams) {
  return useQuery({
    queryKey: ['cases', params],
    queryFn: () => caseService.getCases(params),
  })
}

export function useCase(id: string) {
  return useQuery({
    queryKey: ['cases', id],
    queryFn: () => caseService.getCase(id),
    enabled: id.length > 0,
  })
}

export function useCreateCase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCaseInput) => caseService.createCase(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cases'] })
    },
  })
}

export function useUpdateCase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCaseInput }) =>
      caseService.updateCase(id, data),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: ['cases'] })
      void queryClient.invalidateQueries({ queryKey: ['cases', id] })
    },
  })
}
