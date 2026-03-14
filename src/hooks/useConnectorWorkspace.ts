'use client'

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { connectorWorkspaceService } from '@/services/connector-workspace.service'
import { useTenantStore } from '@/stores'
import type { WorkspaceSearchRequest } from '@/types'

export function useWorkspaceOverview(type: string, enabled = true) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['connector-workspace', tenantId, type, 'overview'],
    queryFn: () => connectorWorkspaceService.getOverview(type),
    enabled: Boolean(type) && enabled,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  })
}

export function useWorkspaceRecentActivity(type: string, page = 1, pageSize = 20, enabled = true) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['connector-workspace', tenantId, type, 'recent-activity', page, pageSize],
    queryFn: () => connectorWorkspaceService.getRecentActivity(type, page, pageSize),
    enabled: Boolean(type) && enabled,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  })
}

export function useWorkspaceEntities(type: string, page = 1, pageSize = 20, enabled = true) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['connector-workspace', tenantId, type, 'entities', page, pageSize],
    queryFn: () => connectorWorkspaceService.getEntities(type, page, pageSize),
    enabled: Boolean(type) && enabled,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  })
}

export function useWorkspaceSearch(type: string) {
  return useMutation({
    mutationFn: (request: WorkspaceSearchRequest) =>
      connectorWorkspaceService.search(type, request),
  })
}

export function useWorkspaceAction(type: string) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ action, params }: { action: string; params?: Record<string, unknown> }) =>
      connectorWorkspaceService.executeAction(type, action, params),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['connector-workspace', tenantId, type],
      })
    },
  })
}
