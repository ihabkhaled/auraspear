import api from '@/lib/api'
import type {
  AddUserInput,
  ApiResponse,
  AuditLogEntry,
  AuditLogParams,
  CreateTenantInput,
  ServiceHealth,
  Tenant,
  TenantUser,
} from '@/types'

export const adminService = {
  getTenants: () => api.get<ApiResponse<Tenant[]>>('/admin/tenants').then(r => r.data),

  getCurrentTenant: () => api.get<ApiResponse<Tenant>>('/admin/tenants/current').then(r => r.data),

  createTenant: (data: CreateTenantInput) =>
    api.post<ApiResponse<Tenant>>('/admin/tenants', data).then(r => r.data),

  getUsers: (tenantId: string) =>
    api.get<ApiResponse<TenantUser[]>>(`/admin/tenants/${tenantId}/users`).then(r => r.data),

  addUser: (tenantId: string, data: AddUserInput) =>
    api.post<ApiResponse<TenantUser>>(`/admin/tenants/${tenantId}/users`, data).then(r => r.data),

  getServiceHealth: () => api.get<ApiResponse<ServiceHealth[]>>('/admin/health').then(r => r.data),

  getAuditLogs: (params?: AuditLogParams) =>
    api.get<ApiResponse<AuditLogEntry[]>>('/admin/audit-logs', { params }).then(r => r.data),

  updateTenant: (tenantId: string, data: { name: string }) =>
    api.patch<ApiResponse<Tenant>>(`/admin/tenants/${tenantId}`, data).then(r => r.data),

  deleteTenant: (tenantId: string) =>
    api.delete<ApiResponse<{ deleted: boolean }>>(`/admin/tenants/${tenantId}`).then(r => r.data),

  updateUser: (
    tenantId: string,
    userId: string,
    data: { name?: string; role?: string; password?: string }
  ) =>
    api
      .patch<ApiResponse<TenantUser>>(`/admin/tenants/${tenantId}/users/${userId}`, data)
      .then(r => r.data),

  removeUser: (tenantId: string, userId: string) =>
    api
      .delete<ApiResponse<{ deleted: boolean }>>(`/admin/tenants/${tenantId}/users/${userId}`)
      .then(r => r.data),

  blockUser: (tenantId: string, userId: string) =>
    api
      .post<ApiResponse<TenantUser>>(`/admin/tenants/${tenantId}/users/${userId}/block`)
      .then(r => r.data),

  unblockUser: (tenantId: string, userId: string) =>
    api
      .post<ApiResponse<TenantUser>>(`/admin/tenants/${tenantId}/users/${userId}/unblock`)
      .then(r => r.data),

  restoreUser: (tenantId: string, userId: string) =>
    api
      .post<ApiResponse<TenantUser>>(`/admin/tenants/${tenantId}/users/${userId}/restore`)
      .then(r => r.data),
}
