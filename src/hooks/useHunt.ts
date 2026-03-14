import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { huntService } from '@/services'
import { useTenantStore } from '@/stores'

export function useCreateHuntSession() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { query: string; timeRange: string }) => huntService.createSession(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['hunt', tenantId] })
    },
  })
}

export function useSendHuntMessage() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sessionId, content }: { sessionId: string; content: string }) =>
      huntService.sendMessage(sessionId, content),
    onSuccess: (_data, { sessionId }) => {
      void queryClient.invalidateQueries({ queryKey: ['hunt', tenantId, sessionId] })
    },
  })
}

export function useHuntEvents(sessionId: string) {
  const tenantId = useTenantStore(s => s.currentTenantId)

  return useQuery({
    queryKey: ['hunt', tenantId, sessionId, 'events'],
    queryFn: () => huntService.getEvents(sessionId),
    enabled: sessionId.length > 0,
  })
}
