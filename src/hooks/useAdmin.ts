import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { POLLING_INTERVAL } from '@/lib/constants'
import { adminService } from '@/services'
import type { CreateTenantInput } from '@/services/admin.service'

export function useTenants(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'tenants'],
    queryFn: () => adminService.getTenants(),
    enabled,
  })
}

export function useCreateTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTenantInput) => adminService.createTenant(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] })
    },
  })
}

export function useTenantUsers(tenantId: string) {
  return useQuery({
    queryKey: ['admin', 'tenants', tenantId, 'users'],
    queryFn: () => adminService.getUsers(tenantId),
    enabled: tenantId.length > 0,
  })
}

export function useServiceHealth() {
  return useQuery({
    queryKey: ['admin', 'service-health'],
    queryFn: () => adminService.getServiceHealth(),
    refetchInterval: POLLING_INTERVAL,
  })
}

interface AuditLogParams {
  page?: number
  limit?: number
  actor?: string
  action?: string
}

export function useAuditLogs(params?: AuditLogParams) {
  return useQuery({
    queryKey: ['admin', 'audit-logs', params],
    queryFn: () => adminService.getAuditLogs(params),
  })
}
