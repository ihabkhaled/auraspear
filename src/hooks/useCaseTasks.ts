import { useMutation, useQueryClient } from '@tanstack/react-query'
import { caseService } from '@/services'
import { useTenantStore } from '@/stores'

export function useCreateCaseTask(caseId: string) {
  const queryClient = useQueryClient()
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useMutation({
    mutationFn: (data: { title: string; assignee?: string }) =>
      caseService.createTask(caseId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cases', tenantId, caseId] })
    },
  })
}

export function useUpdateCaseTask(caseId: string) {
  const queryClient = useQueryClient()
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string
      data: { title?: string; status?: string; assignee?: string | null }
    }) => caseService.updateTask(caseId, taskId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cases', tenantId, caseId] })
    },
  })
}

export function useDeleteCaseTask(caseId: string) {
  const queryClient = useQueryClient()
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useMutation({
    mutationFn: (taskId: string) => caseService.deleteTask(caseId, taskId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cases', tenantId, caseId] })
    },
  })
}
