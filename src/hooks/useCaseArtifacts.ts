import { useMutation, useQueryClient } from '@tanstack/react-query'
import { caseService } from '@/services'
import { useTenantStore } from '@/stores'

export function useCreateCaseArtifact(caseId: string) {
  const queryClient = useQueryClient()
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useMutation({
    mutationFn: (data: { type: string; value: string; source?: string }) =>
      caseService.createArtifact(caseId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cases', tenantId, caseId] })
    },
  })
}

export function useDeleteCaseArtifact(caseId: string) {
  const queryClient = useQueryClient()
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useMutation({
    mutationFn: (artifactId: string) => caseService.deleteArtifact(caseId, artifactId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cases', tenantId, caseId] })
    },
  })
}
