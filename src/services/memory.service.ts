import api from '@/lib/api'
import { extractApiData } from '@/lib/utils'
import type {
  CreateMemoryInput,
  MemoryRetentionPolicy,
  MemoryStats,
  UpdateMemoryInput,
  UserMemory,
  UserMemoryListResponse,
} from '@/types'

export const memoryService = {
  list: (params?: { category?: string; search?: string; limit?: number; offset?: number }) =>
    api.get<UserMemoryListResponse>('/user-memory', { params }).then(r => r.data),

  create: (data: CreateMemoryInput) =>
    api.post('/user-memory', data).then(r => extractApiData<UserMemory>(r)),

  update: (id: string, data: UpdateMemoryInput) =>
    api.patch(`/user-memory/${id}`, data).then(r => extractApiData<UserMemory>(r)),

  delete: (id: string) => api.delete(`/user-memory/${id}`).then(r => extractApiData<void>(r)),

  deleteAll: () => api.delete('/user-memory').then(r => extractApiData<{ deleted: number }>(r)),

  /* ── Governance ────────────────────────────────────── */

  getStats: () =>
    api.get('/user-memory/governance/stats').then(r => extractApiData<MemoryStats>(r)),

  listAll: (params?: Record<string, string | number>) =>
    api.get('/user-memory/governance/all', { params }).then(r => {
      // Backend returns { data: UserMemory[], total: number }
      // Proxy sees `data` key and passes through, so r.data IS { data: [...], total: N }
      const body = r.data as { data: UserMemory[]; total: number }
      return { data: Array.isArray(body.data) ? body.data : [], total: Number(body.total ?? 0) }
    }),

  exportMemories: (userId?: string) =>
    api
      .get('/user-memory/governance/export', {
        params: userId ? { userId } : {},
      })
      .then(r => {
        // Backend returns { data: UserMemory[] } — proxy passes through
        const body = r.data as { data: UserMemory[] }
        return Array.isArray(body.data) ? body.data : []
      }),

  getRetentionPolicy: () =>
    api
      .get('/user-memory/governance/retention')
      .then(r => extractApiData<MemoryRetentionPolicy | null>(r)),

  upsertRetentionPolicy: (data: { retentionDays: number; autoCleanup: boolean }) =>
    api
      .patch('/user-memory/governance/retention', data)
      .then(r => extractApiData<MemoryRetentionPolicy>(r)),

  runCleanup: () =>
    api.post('/user-memory/governance/cleanup').then(r => extractApiData<{ cleaned: number }>(r)),

  adminDeleteUserMemories: (userId: string) =>
    api
      .delete(`/user-memory/governance/user/${userId}`)
      .then(r => extractApiData<{ deleted: number }>(r)),
}
