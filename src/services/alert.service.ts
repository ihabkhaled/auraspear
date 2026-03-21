import api from '@/lib/api'
import type {
  ApiResponse,
  Alert,
  AlertSearchParams,
  AIInvestigation,
  AiTriageResult,
  BulkActionResult,
  AlertTimelineEvent,
} from '@/types'

export const alertService = {
  getAlerts: (params?: AlertSearchParams) =>
    api.get<ApiResponse<Alert[]>>('/alerts', { params }).then(r => r.data),

  getAlertById: (id: string) => api.get<ApiResponse<Alert>>(`/alerts/${id}`).then(r => r.data),

  investigateAlert: (id: string) =>
    api.post<ApiResponse<AIInvestigation>>(`/alerts/${id}/investigate`).then(r => r.data),

  bulkAcknowledge: (ids: string[]) =>
    api.post<ApiResponse<BulkActionResult>>('/alerts/bulk/acknowledge', { ids }).then(r => r.data),

  bulkClose: (ids: string[], resolution: string) =>
    api
      .post<ApiResponse<BulkActionResult>>('/alerts/bulk/close', { ids, resolution })
      .then(r => r.data),

  getAlertTimeline: (id: string) =>
    api.get<ApiResponse<AlertTimelineEvent[]>>(`/alerts/${id}/timeline`).then(r => r.data),

  triageSummarize: (alertId: string) =>
    api
      .post<ApiResponse<AiTriageResult>>(`/alerts/${alertId}/ai/summarize`)
      .then(r => r.data.data),

  triageExplainSeverity: (alertId: string) =>
    api
      .post<ApiResponse<AiTriageResult>>(`/alerts/${alertId}/ai/explain-severity`)
      .then(r => r.data.data),

  triageFalsePositiveScore: (alertId: string) =>
    api
      .post<ApiResponse<AiTriageResult>>(`/alerts/${alertId}/ai/false-positive-score`)
      .then(r => r.data.data),

  triageNextAction: (alertId: string) =>
    api
      .post<ApiResponse<AiTriageResult>>(`/alerts/${alertId}/ai/next-action`)
      .then(r => r.data.data),
}
