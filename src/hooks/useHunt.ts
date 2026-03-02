import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { huntService } from '@/services'

export function useCreateHuntSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { query: string; timeRange: string }) => huntService.createSession(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['hunt'] })
    },
  })
}

export function useSendHuntMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sessionId, content }: { sessionId: string; content: string }) =>
      huntService.sendMessage(sessionId, content),
    onSuccess: (_data, { sessionId }) => {
      void queryClient.invalidateQueries({ queryKey: ['hunt', sessionId] })
    },
  })
}

export function useHuntEvents(sessionId: string) {
  return useQuery({
    queryKey: ['hunt', sessionId, 'events'],
    queryFn: () => huntService.getEvents(sessionId),
    enabled: sessionId.length > 0,
  })
}
