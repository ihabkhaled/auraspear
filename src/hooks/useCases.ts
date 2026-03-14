import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService, caseService } from '@/services'
import { useTenantStore } from '@/stores'
import type { CaseSearchParams, CreateCaseInput, UpdateCaseInput } from '@/types'

export function useTenantMembers() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['tenantMembers', tenantId],
    queryFn: () => adminService.getMembers(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCases(params?: CaseSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['cases', tenantId, params],
    queryFn: () => caseService.getCases(params),
  })
}

export function useCase(id: string) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['cases', tenantId, id],
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
  const tenantId = useTenantStore(s => s.currentTenantId)

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCaseInput }) =>
      caseService.updateCase(id, data),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: ['cases'] })
      void queryClient.invalidateQueries({ queryKey: ['cases', tenantId, id] })
    },
  })
}
