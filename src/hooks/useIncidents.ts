import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { incidentService } from '@/services'
import { useTenantStore } from '@/stores'
import type { IncidentSearchParams } from '@/types'

export function useIncidents(params?: IncidentSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['incidents', tenantId, params],
    queryFn: () => incidentService.getIncidents(params),
    placeholderData: keepPreviousData,
  })
}

export function useIncidentStats() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['incidents', 'stats', tenantId],
    queryFn: () => incidentService.getIncidentStats(),
  })
}

export function useCreateIncident() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => incidentService.createIncident(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['incidents'] })
    },
  })
}

export function useUpdateIncident() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      incidentService.updateIncident(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['incidents'] })
    },
  })
}

export function useDeleteIncident() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => incidentService.deleteIncident(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['incidents'] })
    },
  })
}

export function useIncidentTimeline(incidentId: string) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['incidents', 'timeline', tenantId, incidentId],
    queryFn: () => incidentService.getIncidentTimeline(incidentId),
    enabled: incidentId.length > 0,
  })
}

export function useAddTimelineEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { event: string; actorType?: string } }) =>
      incidentService.addTimelineEntry(id, data),
    onSuccess: (_result, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['incidents', 'timeline'],
      })
      void queryClient.invalidateQueries({
        queryKey: ['incidents', variables.id],
      })
    },
  })
}
