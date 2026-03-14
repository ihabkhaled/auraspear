import { useMutation, useQueryClient } from '@tanstack/react-query'
import { caseService } from '@/services'

export function useCreateCaseArtifact(caseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { type: string; value: string; source?: string }) =>
      caseService.createArtifact(caseId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cases', caseId] })
    },
  })
}

export function useDeleteCaseArtifact(caseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (artifactId: string) => caseService.deleteArtifact(caseId, artifactId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cases', caseId] })
    },
  })
}
