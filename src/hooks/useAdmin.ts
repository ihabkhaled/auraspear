import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { POLLING_INTERVAL } from '@/lib/constants'
import { adminService } from '@/services'
import type { AddUserInput, AuditLogParams, CreateTenantInput } from '@/types'

export function useTenants(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'tenants'],
    queryFn: () => adminService.getTenants(),
    enabled,
  })
}

export function useCurrentTenant(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'current-tenant'],
    queryFn: () => adminService.getCurrentTenant(),
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

export function useAddUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string; data: AddUserInput }) =>
      adminService.addUser(tenantId, data),
    onSuccess: (_data, { tenantId }) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants', tenantId, 'users'] })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] })
    },
  })
}

export function useServiceHealth() {
  return useQuery({
    queryKey: ['admin', 'service-health'],
    queryFn: () => adminService.getServiceHealth(),
    refetchInterval: POLLING_INTERVAL,
  })
}

export function useAuditLogs(params?: AuditLogParams) {
  return useQuery({
    queryKey: ['admin', 'audit-logs', params],
    queryFn: () => adminService.getAuditLogs(params),
  })
}

export function useUpdateTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string; data: { name: string } }) =>
      adminService.updateTenant(tenantId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] })
    },
  })
}

export function useDeleteTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tenantId: string) => adminService.deleteTenant(tenantId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      tenantId,
      userId,
      data,
    }: {
      tenantId: string
      userId: string
      data: { name?: string; role?: string; password?: string }
    }) => adminService.updateUser(tenantId, userId, data),
    onSuccess: (_data, { tenantId }) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants', tenantId, 'users'] })
    },
  })
}

export function useRemoveUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tenantId, userId }: { tenantId: string; userId: string }) =>
      adminService.removeUser(tenantId, userId),
    onSuccess: (_data, { tenantId }) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants', tenantId, 'users'] })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] })
    },
  })
}

export function useBlockUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tenantId, userId }: { tenantId: string; userId: string }) =>
      adminService.blockUser(tenantId, userId),
    onSuccess: (_data, { tenantId }) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants', tenantId, 'users'] })
    },
  })
}

export function useUnblockUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tenantId, userId }: { tenantId: string; userId: string }) =>
      adminService.unblockUser(tenantId, userId),
    onSuccess: (_data, { tenantId }) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants', tenantId, 'users'] })
    },
  })
}

export function useRestoreUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tenantId, userId }: { tenantId: string; userId: string }) =>
      adminService.restoreUser(tenantId, userId),
    onSuccess: (_data, { tenantId }) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants', tenantId, 'users'] })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] })
    },
  })
}
