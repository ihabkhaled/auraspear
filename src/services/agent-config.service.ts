import api from '@/lib/api'
import type {
  ApiResponse,
  ApprovalRequest,
  CreateOsintSourceInput,
  OsintSourceConfig,
  ResolveApprovalInput,
  TenantAgentConfig,
  UpdateAgentConfigInput,
  UpdateOsintSourceInput,
} from '@/types'

export const agentConfigService = {
  getAgentConfigs: () =>
    api.get<ApiResponse<TenantAgentConfig[]>>('/agent-config/agents').then(r => r.data),

  getAgentConfig: (agentId: string) =>
    api.get<ApiResponse<TenantAgentConfig>>(`/agent-config/agents/${agentId}`).then(r => r.data),

  updateAgentConfig: (agentId: string, data: UpdateAgentConfigInput) =>
    api
      .patch<ApiResponse<TenantAgentConfig>>(`/agent-config/agents/${agentId}`, data)
      .then(r => r.data),

  toggleAgent: (agentId: string, enabled: boolean) =>
    api
      .post<ApiResponse<TenantAgentConfig>>(`/agent-config/agents/${agentId}/toggle`, {
        enabled,
      })
      .then(r => r.data),

  resetUsage: (agentId: string, period: string) =>
    api
      .post<ApiResponse<TenantAgentConfig>>(`/agent-config/agents/${agentId}/reset-usage/${period}`)
      .then(r => r.data),

  getOsintSources: () =>
    api.get<ApiResponse<OsintSourceConfig[]>>('/agent-config/osint-sources').then(r => r.data),

  createOsintSource: (data: CreateOsintSourceInput) =>
    api.post<ApiResponse<OsintSourceConfig>>('/agent-config/osint-sources', data).then(r => r.data),

  updateOsintSource: (id: string, data: UpdateOsintSourceInput) =>
    api
      .patch<ApiResponse<OsintSourceConfig>>(`/agent-config/osint-sources/${id}`, data)
      .then(r => r.data),

  deleteOsintSource: (id: string) =>
    api
      .delete<ApiResponse<{ deleted: boolean }>>(`/agent-config/osint-sources/${id}`)
      .then(r => r.data),

  testOsintSource: (id: string) =>
    api
      .post<
        ApiResponse<{ success: boolean; message: string }>
      >(`/agent-config/osint-sources/${id}/test`)
      .then(r => r.data),

  getApprovals: (status?: string) =>
    api
      .get<ApiResponse<ApprovalRequest[]>>('/agent-config/approvals', {
        params: status ? { status } : undefined,
      })
      .then(r => r.data),

  resolveApproval: (id: string, data: ResolveApprovalInput) =>
    api
      .post<ApiResponse<ApprovalRequest>>(`/agent-config/approvals/${id}/resolve`, data)
      .then(r => r.data),
}
