import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { alertService } from '@/services'
import { useTenantStore } from '@/stores'
import type { AlertSearchParams, BulkCloseInput } from '@/types'

export function useAlerts(params?: AlertSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['alerts', tenantId, params],
    queryFn: () => alertService.getAlerts(params),
  })
}

export function useAlert(id: string) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['alerts', tenantId, id],
    queryFn: () => alertService.getAlertById(id),
    enabled: id.length > 0,
  })
}

export function useInvestigateAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => alertService.investigateAlert(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: ['alerts', id] })
    },
  })
}

export function useBulkAcknowledgeAlerts() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => alertService.bulkAcknowledge(ids),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['alerts'] })
    },
  })
}

export function useBulkCloseAlerts() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, resolution }: BulkCloseInput) => alertService.bulkClose(ids, resolution),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['alerts'] })
    },
  })
}

export function useAlertTimeline(alertId: string) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['alerts', 'timeline', tenantId, alertId],
    queryFn: () => alertService.getAlertTimeline(alertId),
    enabled: alertId.length > 0,
  })
}
