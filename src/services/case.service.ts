import api from '@/lib/api'
import type { ApiResponse, Case, CaseSearchParams, CreateCaseInput, UpdateCaseInput } from '@/types'

export const caseService = {
  getCases: (params?: CaseSearchParams) =>
    api.get<ApiResponse<Case[]>>('/cases', { params }).then(r => r.data),

  getCase: (id: string) => api.get<ApiResponse<Case>>(`/cases/${id}`).then(r => r.data),

  createCase: (data: CreateCaseInput) =>
    api.post<ApiResponse<Case>>('/cases', data).then(r => r.data),

  updateCase: (id: string, data: UpdateCaseInput) =>
    api.patch<ApiResponse<Case>>(`/cases/${id}`, data).then(r => r.data),
}
