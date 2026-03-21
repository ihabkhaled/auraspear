import type { JobStatus, JobType } from '@/enums'

export interface JobRecord {
  id: string
  tenantId: string
  type: JobType
  status: JobStatus
  payload: Record<string, unknown>
  result: Record<string, unknown> | null
  error: string | null
  attempts: number
  maxAttempts: number
  idempotencyKey: string | null
  scheduledAt: string | null
  startedAt: string | null
  completedAt: string | null
  createdBy: string | null
  createdAt: string
  updatedAt: string
}

export interface JobSearchParams {
  page?: number
  limit?: number
  type?: JobType
  status?: JobStatus
  sortBy?: string
  sortOrder?: string
}

export interface JobTypeBreakdown {
  type: JobType
  count: number
}

export interface JobRuntimeStats {
  total: number
  pending: number
  running: number
  retrying: number
  failed: number
  completed: number
  cancelled: number
  delayed: number
  staleRunning: number
  typeBreakdown: JobTypeBreakdown[]
}

export interface RunAiAgentInput {
  prompt: string
  connector?: string | undefined
}

export interface AiAgentRunResult {
  queued: boolean
  jobId: string
  sessionId: string
}

export interface CancelJobResult {
  cancelled: boolean
}
