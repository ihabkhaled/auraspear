'use client'

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { connectorWorkspaceService } from '@/services/connector-workspace.service'
import type { WorkspaceSearchRequest } from '@/types'

const WORKSPACE_KEY = ['connector-workspace'] as const

export function useWorkspaceOverview(type: string, enabled = true) {
  return useQuery({
    queryKey: [...WORKSPACE_KEY, type, 'overview'],
    queryFn: () => connectorWorkspaceService.getOverview(type),
    enabled: Boolean(type) && enabled,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  })
}

export function useWorkspaceRecentActivity(type: string, page = 1, pageSize = 20, enabled = true) {
  return useQuery({
    queryKey: [...WORKSPACE_KEY, type, 'recent-activity', page, pageSize],
    queryFn: () => connectorWorkspaceService.getRecentActivity(type, page, pageSize),
    enabled: Boolean(type) && enabled,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  })
}

export function useWorkspaceEntities(type: string, page = 1, pageSize = 20, enabled = true) {
  return useQuery({
    queryKey: [...WORKSPACE_KEY, type, 'entities', page, pageSize],
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
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ action, params }: { action: string; params?: Record<string, unknown> }) =>
      connectorWorkspaceService.executeAction(type, action, params),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...WORKSPACE_KEY, type] })
    },
  })
}
