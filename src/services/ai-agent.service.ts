import api from '@/lib/api'
import type {
  AiAgent,
  AiAgentSearchParams,
  AiAgentRunResult,
  AiAgentSession,
  AiAgentSessionSearchParams,
  AiAgentStats,
  ApiResponse,
  DeleteAiAgentResult,
  RunAiAgentInput,
  UpdateAiAgentSoulInput,
} from '@/types'

export const aiAgentService = {
  getAgents: (params?: AiAgentSearchParams) =>
    api.get<ApiResponse<AiAgent[]>>('/ai-agents', { params }).then(r => r.data),

  getAgentById: (id: string) => api.get<ApiResponse<AiAgent>>(`/ai-agents/${id}`).then(r => r.data),

  getAgentStats: () => api.get<ApiResponse<AiAgentStats>>('/ai-agents/stats').then(r => r.data),

  getAgentSessions: (agentId: string, params?: AiAgentSessionSearchParams) =>
    api
      .get<ApiResponse<AiAgentSession[]>>(`/ai-agents/${agentId}/sessions`, { params })
      .then(r => r.data),

  updateSoul: (id: string, data: UpdateAiAgentSoulInput) =>
    api.patch<ApiResponse<AiAgent>>(`/ai-agents/${id}/soul`, data).then(r => r.data),

  startAgent: (id: string) =>
    api.post<ApiResponse<AiAgent>>(`/ai-agents/${id}/start`).then(r => r.data),

  stopAgent: (id: string) =>
    api.post<ApiResponse<AiAgent>>(`/ai-agents/${id}/stop`).then(r => r.data),

  runAgent: (id: string, data: RunAiAgentInput) =>
    api.post<ApiResponse<AiAgentRunResult>>(`/ai-agents/${id}/run`, data).then(r => r.data),

  createAgent: (data: Record<string, unknown>) =>
    api.post<ApiResponse<AiAgent>>('/ai-agents', data).then(r => r.data),

  updateAgent: (id: string, data: Record<string, unknown>) =>
    api.patch<ApiResponse<AiAgent>>(`/ai-agents/${id}`, data).then(r => r.data),

  deleteAgent: (id: string) =>
    api.delete<ApiResponse<DeleteAiAgentResult>>(`/ai-agents/${id}`).then(r => r.data),
}
