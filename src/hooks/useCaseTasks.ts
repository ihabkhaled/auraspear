import { useMutation, useQueryClient } from '@tanstack/react-query'
import { caseService } from '@/services'

export function useCreateCaseTask(caseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { title: string; assignee?: string }) =>
      caseService.createTask(caseId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cases', caseId] })
    },
  })
}

export function useUpdateCaseTask(caseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string
      data: { title?: string; status?: string; assignee?: string | null }
    }) => caseService.updateTask(caseId, taskId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cases', caseId] })
    },
  })
}

export function useDeleteCaseTask(caseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (taskId: string) => caseService.deleteTask(caseId, taskId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cases', caseId] })
    },
  })
}
