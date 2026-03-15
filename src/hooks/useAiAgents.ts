import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { aiAgentService } from '@/services'
import { useTenantStore } from '@/stores'
import type { AiAgentSearchParams, AiAgentSessionSearchParams } from '@/types'

export function useAiAgents(params?: AiAgentSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['ai-agents', tenantId, params],
    queryFn: () => aiAgentService.getAgents(params),
    placeholderData: keepPreviousData,
  })
}

export function useAiAgentStats() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['ai-agents', 'stats', tenantId],
    queryFn: () => aiAgentService.getAgentStats(),
  })
}

export function useAiAgent(id: string) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['ai-agents', id, tenantId],
    queryFn: () => aiAgentService.getAgentById(id),
    enabled: id.length > 0,
  })
}

export function useAiAgentSessions(agentId: string, params?: AiAgentSessionSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['ai-agents', agentId, 'sessions', tenantId, params],
    queryFn: () => aiAgentService.getAgentSessions(agentId, params),
    enabled: agentId.length > 0,
  })
}

export function useUpdateSoul() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, soulMd }: { id: string; soulMd: string }) =>
      aiAgentService.updateSoul(id, { soulMd }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ai-agents'] })
    },
  })
}

export function useStopAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => aiAgentService.stopAgent(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ai-agents'] })
    },
  })
}

export function useCreateAiAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => aiAgentService.createAgent(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ai-agents'] })
    },
  })
}

export function useUpdateAiAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      aiAgentService.updateAgent(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ai-agents'] })
    },
  })
}

export function useDeleteAiAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => aiAgentService.deleteAgent(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ai-agents'] })
    },
  })
}
