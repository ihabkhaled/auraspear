'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { agentConfigService } from '@/services'
import { useTenantStore } from '@/stores'
import type { UpdateAgentConfigInput } from '@/types'

export function useAgentConfigs() {
  const tenantId = useTenantStore(s => s.currentTenantId)

  return useQuery({
    queryKey: ['agent-config', 'agents', tenantId],
    queryFn: () => agentConfigService.getAgentConfigs(),
  })
}

export function useAgentConfig(agentId: string | null) {
  const tenantId = useTenantStore(s => s.currentTenantId)

  return useQuery({
    queryKey: ['agent-config', 'agents', agentId, tenantId],
    queryFn: () => agentConfigService.getAgentConfig(agentId ?? ''),
    enabled: Boolean(agentId),
  })
}

export function useUpdateAgentConfig() {
  const queryClient = useQueryClient()
  const tenantId = useTenantStore(s => s.currentTenantId)

  return useMutation({
    mutationFn: ({ agentId, data }: { agentId: string; data: UpdateAgentConfigInput }) =>
      agentConfigService.updateAgentConfig(agentId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['agent-config', 'agents', tenantId] })
    },
  })
}

export function useToggleAgent() {
  const queryClient = useQueryClient()
  const tenantId = useTenantStore(s => s.currentTenantId)

  return useMutation({
    mutationFn: ({ agentId, enabled }: { agentId: string; enabled: boolean }) =>
      agentConfigService.toggleAgent(agentId, enabled),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['agent-config', 'agents', tenantId] })
    },
  })
}

export function useResetUsage() {
  const queryClient = useQueryClient()
  const tenantId = useTenantStore(s => s.currentTenantId)

  return useMutation({
    mutationFn: ({ agentId, period }: { agentId: string; period: string }) =>
      agentConfigService.resetUsage(agentId, period),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['agent-config', 'agents', tenantId] })
    },
  })
}
