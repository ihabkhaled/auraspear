import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { attackPathService } from '@/services'
import { useTenantStore } from '@/stores'
import type { AttackPathSearchParams } from '@/types'

export function useAttackPaths(params?: AttackPathSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['attack-paths', tenantId, params],
    queryFn: () => attackPathService.getAttackPaths(params),
    placeholderData: keepPreviousData,
  })
}

export function useAttackPathStats() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['attack-paths', 'stats', tenantId],
    queryFn: () => attackPathService.getAttackPathStats(),
  })
}

export function useAttackPath(id: string) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['attack-paths', id, tenantId],
    queryFn: () => attackPathService.getAttackPathById(id),
    enabled: id.length > 0,
  })
}

export function useCreateAttackPath() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => attackPathService.createAttackPath(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['attack-paths'] })
    },
  })
}

export function useUpdateAttackPath() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      attackPathService.updateAttackPath(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['attack-paths'] })
    },
  })
}

export function useDeleteAttackPath() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => attackPathService.deleteAttackPath(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['attack-paths'] })
    },
  })
}
