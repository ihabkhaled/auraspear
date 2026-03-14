import type { HuntStatus, MessageRole, ReasoningStepStatus } from '@/enums'

export interface ReasoningStep {
  id: string
  label: string
  status: ReasoningStepStatus
}

export interface HuntMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string
  reasoningSteps?: ReasoningStep[]
  actions?: string[]
}

export interface HuntSession {
  id: string
  status: HuntStatus
  createdAt: string
  query: string
  timeRange: string
  startedBy: string
  messages: HuntMessage[]
  eventsFound: number
  uniqueIps: number
  threatScore: number
  mitreTactics: string[]
  mitreTechniques: string[]
  aiAnalysis: string | null
  reasoning: string[]
  executedQuery: Record<string, unknown> | null
}

export interface HuntEvent {
  id: string
  timestamp: string
  severity: string
  eventId: string
  sourceIp: string | null
  user: string | null
  description: string
}
