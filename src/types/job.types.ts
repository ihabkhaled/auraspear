export type JobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'retrying' | 'cancelled'

export type JobType =
  | 'connector_sync'
  | 'detection_rule_execution'
  | 'correlation_rule_execution'
  | 'normalization_pipeline'
  | 'soar_playbook'
  | 'hunt_execution'
  | 'ai_agent_task'
  | 'report_generation'

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
}

export interface JobTypeBreakdown {
  type: string
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
}

export interface AiAgentRunResult {
  queued: boolean
  jobId: string
  sessionId: string
}
