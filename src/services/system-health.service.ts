import api from '@/lib/api'
import type {
  ApiResponse,
  SystemHealthCheck,
  SystemMetric,
  SystemHealthStats,
  HealthCheckSearchParams,
  MetricSearchParams,
} from '@/types'

export const systemHealthService = {
  listHealthChecks: (params?: HealthCheckSearchParams) =>
    api
      .get<ApiResponse<SystemHealthCheck[]>>('/system-health/checks', { params })
      .then(r => r.data),

  getLatestChecks: () =>
    api.get<ApiResponse<SystemHealthCheck[]>>('/system-health/checks/latest').then(r => r.data),

  listMetrics: (params?: MetricSearchParams) =>
    api.get<ApiResponse<SystemMetric[]>>('/system-health/metrics', { params }).then(r => r.data),

  getStats: () => api.get<ApiResponse<SystemHealthStats>>('/system-health/stats').then(r => r.data),

  createHealthCheck: (data: Record<string, unknown>) =>
    api.post<ApiResponse<SystemHealthCheck>>('/system-health/checks', data).then(r => r.data),

  updateHealthCheck: (id: string, data: Record<string, unknown>) =>
    api
      .patch<ApiResponse<SystemHealthCheck>>(`/system-health/checks/${id}`, data)
      .then(r => r.data),

  deleteHealthCheck: (id: string) =>
    api.delete<ApiResponse<{ deleted: boolean }>>(`/system-health/checks/${id}`).then(r => r.data),
}
