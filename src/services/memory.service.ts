import api from '@/lib/api'
import type { ApiResponse, CreateMemoryInput, UpdateMemoryInput, UserMemory, UserMemoryListResponse } from '@/types'

export const memoryService = {
  list: (params?: { category?: string; search?: string; limit?: number; offset?: number }) =>
    api.get<UserMemoryListResponse>('/user-memory', { params }).then(r => r.data),

  create: (data: CreateMemoryInput) =>
    api.post<ApiResponse<UserMemory>>('/user-memory', data).then(r => r.data),

  update: (id: string, data: UpdateMemoryInput) =>
    api.patch<ApiResponse<UserMemory>>(`/user-memory/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/user-memory/${id}`).then(r => r.data),

  deleteAll: () =>
    api.delete<ApiResponse<{ deleted: number }>>('/user-memory').then(r => r.data),
}
