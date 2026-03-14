import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { POLLING_INTERVAL } from '@/lib/constants'
import { adminService } from '@/services'
import { useTenantStore } from '@/stores'
import type {
  AddUserInput,
  AssignUserInput,
  AuditLogParams,
  CreateTenantInput,
  TenantListParams,
  TenantUserListParams,
} from '@/types'

export function useTenants(params?: TenantListParams, enabled = true) {
  return useQuery({
    queryKey: ['admin', 'tenants', params],
    queryFn: () => adminService.getTenants(params),
    enabled,
    placeholderData: keepPreviousData,
  })
}

export function useCurrentTenant(enabled = true) {
  const tenantId = useTenantStore(s => s.currentTenantId)

  return useQuery({
    queryKey: ['admin', tenantId, 'current-tenant'],
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

export function useTenantUsers(tenantId: string, params?: TenantUserListParams) {
  return useQuery({
    queryKey: ['admin', 'tenants', tenantId, 'users', params],
    queryFn: () => adminService.getUsers(tenantId, params),
    enabled: tenantId.length > 0,
    placeholderData: keepPreviousData,
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
  const tenantId = useTenantStore(s => s.currentTenantId)

  return useQuery({
    queryKey: ['admin', tenantId, 'service-health'],
    queryFn: () => adminService.getServiceHealth(),
    refetchInterval: POLLING_INTERVAL,
  })
}

export function useAuditLogs(params?: AuditLogParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)

  return useQuery({
    queryKey: ['admin', tenantId, 'audit-logs', params],
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

export function useCheckEmail(tenantId: string, email: string) {
  return useQuery({
    queryKey: ['admin', 'tenants', tenantId, 'check-email', email],
    queryFn: () => adminService.checkEmail(tenantId, email),
    enabled: tenantId.length > 0 && email.length > 0 && email.includes('@'),
  })
}

export function useAssignUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string; data: AssignUserInput }) =>
      adminService.assignUser(tenantId, data),
    onSuccess: (_data, { tenantId }) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants', tenantId, 'users'] })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] })
    },
  })
}

export function useImpersonateUser() {
  return useMutation({
    mutationFn: ({ tenantId, userId }: { tenantId: string; userId: string }) =>
      adminService.impersonateUser(tenantId, userId),
  })
}
