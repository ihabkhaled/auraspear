'use client'

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { connectorService } from '@/services/connector.service'

const CONNECTORS_KEY = ['connectors'] as const
const HEALTH_KEY = ['admin', 'service-health'] as const

export function useConnectors() {
  return useQuery({
    queryKey: CONNECTORS_KEY,
    queryFn: () => connectorService.list(),
    placeholderData: keepPreviousData,
  })
}

export function useConnector(type: string) {
  return useQuery({
    queryKey: [...CONNECTORS_KEY, type],
    queryFn: () => connectorService.getByType(type),
    enabled: Boolean(type),
  })
}

export function useUpdateConnector(type: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => connectorService.update(type, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CONNECTORS_KEY })
      void queryClient.invalidateQueries({ queryKey: HEALTH_KEY })
    },
  })
}

export function useDeleteConnector() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (type: string) => connectorService.remove(type),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CONNECTORS_KEY })
      void queryClient.invalidateQueries({ queryKey: HEALTH_KEY })
    },
  })
}

export function useTestConnector() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (type: string) => connectorService.test(type),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CONNECTORS_KEY })
      void queryClient.invalidateQueries({ queryKey: HEALTH_KEY })
    },
  })
}

export function useToggleConnector() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ type, enabled }: { type: string; enabled: boolean }) =>
      connectorService.toggle(type, enabled),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CONNECTORS_KEY })
      void queryClient.invalidateQueries({ queryKey: HEALTH_KEY })
    },
  })
}
