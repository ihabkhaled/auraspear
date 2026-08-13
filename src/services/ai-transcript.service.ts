import api from '@/lib/api'
import { extractApiData } from '@/lib/utils'
import type {
  AiAuditLogEntry,
  AiTranscriptMessage,
  AiTranscriptPolicy,
  AiTranscriptStats,
  AiTranscriptThread,
} from '@/types'

export const aiTranscriptService = {
  getStats: () => api.get('/ai-transcripts/stats').then(r => extractApiData<AiTranscriptStats>(r)),

  listThreads: (params?: Record<string, string | number>) =>
    api.get('/ai-transcripts/threads', { params }).then(r => {
      const body = r.data as { data: AiTranscriptThread[]; total: number }
      return { data: Array.isArray(body.data) ? body.data : [], total: Number(body.total ?? 0) }
    }),

  getThreadMessages: (threadId: string) =>
    api
      .get(`/ai-transcripts/threads/${threadId}/messages`)
      .then(r => extractApiData<AiTranscriptMessage[]>(r)),

  listAuditLogs: (params?: Record<string, string | number>) =>
    api.get('/ai-transcripts/audit-logs', { params }).then(r => {
      const body = r.data as { data: AiAuditLogEntry[]; total: number }
      return { data: Array.isArray(body.data) ? body.data : [], total: Number(body.total ?? 0) }
    }),

  toggleLegalHold: (threadId: string, legalHold: boolean) =>
    api
      .post(`/ai-transcripts/threads/${threadId}/legal-hold`, { legalHold })
      .then(r => extractApiData<AiTranscriptThread>(r)),

  redactThread: (threadId: string) =>
    api
      .post(`/ai-transcripts/threads/${threadId}/redact`)
      .then(r => extractApiData<{ redacted: number }>(r)),

  exportThread: (threadId: string) =>
    api
      .get(`/ai-transcripts/export/thread/${threadId}`)
      .then(r =>
        extractApiData<{ thread: AiTranscriptThread; messages: AiTranscriptMessage[] }>(r)
      ),

  exportAuditLogs: (from?: string, to?: string) => {
    const params: Record<string, string> = {}
    if (from) params['from'] = from
    if (to) params['to'] = to
    return api
      .get('/ai-transcripts/export/audit-logs', { params })
      .then(r => extractApiData<AiAuditLogEntry[]>(r))
  },

  getPolicy: () =>
    api.get('/ai-transcripts/policy').then(r => extractApiData<AiTranscriptPolicy | null>(r)),

  upsertPolicy: (data: {
    chatRetentionDays: number
    auditRetentionDays: number
    autoRedactPii: boolean
    requireLegalHold: boolean
  }) => api.patch('/ai-transcripts/policy', data).then(r => extractApiData<AiTranscriptPolicy>(r)),

  runCleanup: () =>
    api
      .post('/ai-transcripts/cleanup')
      .then(r => extractApiData<{ chats: number; audits: number }>(r)),
}
