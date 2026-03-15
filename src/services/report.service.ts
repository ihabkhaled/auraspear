import api from '@/lib/api'
import type { ApiResponse, Report, ReportSearchParams, ReportStats } from '@/types'

export const reportService = {
  getReports: (params?: ReportSearchParams) =>
    api.get<ApiResponse<Report[]>>('/reports', { params }).then(r => r.data),

  getReportById: (id: string) => api.get<ApiResponse<Report>>(`/reports/${id}`).then(r => r.data),

  createReport: (data: Record<string, unknown>) =>
    api.post<ApiResponse<Report>>('/reports', data).then(r => r.data),

  updateReport: (id: string, data: Record<string, unknown>) =>
    api.patch<ApiResponse<Report>>(`/reports/${id}`, data).then(r => r.data),

  deleteReport: (id: string) =>
    api.delete<ApiResponse<{ deleted: boolean }>>(`/reports/${id}`).then(r => r.data),

  getStats: () => api.get<ApiResponse<ReportStats>>('/reports/stats').then(r => r.data),
}
