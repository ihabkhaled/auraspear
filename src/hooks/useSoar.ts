import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { soarService } from '@/services'
import { useTenantStore } from '@/stores'
import type { SoarPlaybookSearchParams, SoarExecutionSearchParams } from '@/types'

export function usePlaybooks(params?: SoarPlaybookSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['soar', 'playbooks', tenantId, params],
    queryFn: () => soarService.getPlaybooks(params),
    placeholderData: keepPreviousData,
  })
}

export function usePlaybookStats() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['soar', 'stats', tenantId],
    queryFn: () => soarService.getStats(),
  })
}

export function useCreatePlaybook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => soarService.createPlaybook(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['soar'] })
    },
  })
}

export function useUpdatePlaybook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      soarService.updatePlaybook(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['soar'] })
    },
  })
}

export function useDeletePlaybook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => soarService.deletePlaybook(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['soar'] })
    },
  })
}

export function useExecutions(params?: SoarExecutionSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['soar', 'executions', tenantId, params],
    queryFn: () => soarService.getExecutions(params),
    placeholderData: keepPreviousData,
  })
}

export function useExecutePlaybook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => soarService.executePlaybook(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['soar'] })
    },
  })
}
