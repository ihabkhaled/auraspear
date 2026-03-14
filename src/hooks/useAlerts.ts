import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { alertService } from '@/services'
import { useTenantStore } from '@/stores'
import type { AlertSearchParams } from '@/types'

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
