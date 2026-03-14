import api from '@/lib/api'
import type {
  ApiResponse,
  Case,
  CaseArtifact,
  CaseSearchParams,
  CaseTask,
  CreateCaseInput,
  UpdateCaseInput,
} from '@/types'

export const caseService = {
  getCases: (params?: CaseSearchParams) =>
    api.get<ApiResponse<Case[]>>('/cases', { params }).then(r => r.data),

  getCase: (id: string) => api.get<ApiResponse<Case>>(`/cases/${id}`).then(r => r.data),

  createCase: (data: CreateCaseInput) =>
    api.post<ApiResponse<Case>>('/cases', data).then(r => r.data),

  updateCase: (id: string, data: UpdateCaseInput) =>
    api.patch<ApiResponse<Case>>(`/cases/${id}`, data).then(r => r.data),

  // Tasks
  createTask: (caseId: string, data: { title: string; assignee?: string }) =>
    api.post<{ data: CaseTask }>(`/cases/${caseId}/tasks`, data).then(r => r.data.data),

  updateTask: (
    caseId: string,
    taskId: string,
    data: { title?: string; status?: string; assignee?: string | null }
  ) =>
    api.patch<{ data: CaseTask }>(`/cases/${caseId}/tasks/${taskId}`, data).then(r => r.data.data),

  deleteTask: (caseId: string, taskId: string) =>
    api.delete<{ deleted: boolean }>(`/cases/${caseId}/tasks/${taskId}`).then(r => r.data),

  // Artifacts
  createArtifact: (caseId: string, data: { type: string; value: string; source?: string }) =>
    api.post<{ data: CaseArtifact }>(`/cases/${caseId}/artifacts`, data).then(r => r.data.data),

  deleteArtifact: (caseId: string, artifactId: string) =>
    api.delete<{ deleted: boolean }>(`/cases/${caseId}/artifacts/${artifactId}`).then(r => r.data),
}
