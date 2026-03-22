import {
  type ApprovalStatus,
  type AiAgentId,
  type OsintAuthType,
  type OsintSourceType,
} from '@/enums'
import type { AvailableAiConnector } from './llm-connector.types'

export interface TenantAgentConfig {
  agentId: string
  displayName: string
  description: string
  isEnabled: boolean
  providerMode: string
  model: string | null
  temperature: number
  maxTokensPerCall: number
  systemPrompt: string | null
  promptSuffix: string | null
  indexPatterns: string[]
  tokensPerHour: number
  tokensPerDay: number
  tokensPerMonth: number
  tokensUsedHour: number
  tokensUsedDay: number
  tokensUsedMonth: number
  maxConcurrentRuns: number
  triggerMode: string
  triggerConfig: Record<string, unknown>
  osintSources: unknown[]
  outputFormat: string
  presentationSkills: string[]
  hasCustomConfig: boolean
  lastResetHour: string | null
  lastResetDay: string | null
  lastResetMonth: string | null
}

export interface UpdateAgentConfigInput {
  isEnabled?: boolean
  providerMode?: string
  model?: string | null
  temperature?: number
  maxTokensPerCall?: number
  systemPrompt?: string | null
  promptSuffix?: string | null
  indexPatterns?: string[]
  tokensPerHour?: number
  tokensPerDay?: number
  tokensPerMonth?: number
  maxConcurrentRuns?: number
  triggerMode?: string
  triggerConfig?: Record<string, unknown>
  outputFormat?: string
  presentationSkills?: string[]
}

export interface OsintSourceConfig {
  id: string
  tenantId: string
  sourceType: OsintSourceType
  name: string
  isEnabled: boolean
  hasApiKey: boolean
  baseUrl: string | null
  authType: OsintAuthType
  headerName: string | null
  queryParamName: string | null
  responsePath: string | null
  requestMethod: string
  timeout: number
  lastTestAt: string | null
  lastTestOk: boolean | null
  lastError: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateOsintSourceInput {
  sourceType: OsintSourceType
  name: string
  isEnabled?: boolean
  apiKey?: string
  baseUrl?: string
  authType: OsintAuthType
  headerName?: string
  queryParamName?: string
  responsePath?: string
  requestMethod?: string
  timeout?: number
}

export interface UpdateOsintSourceInput {
  name?: string
  isEnabled?: boolean
  apiKey?: string
  baseUrl?: string
  authType?: OsintAuthType
  headerName?: string
  queryParamName?: string
  responsePath?: string
  requestMethod?: string
  timeout?: number
}

export interface ApprovalRequest {
  id: string
  tenantId: string
  agentId: AiAgentId
  agentName: string
  actionType: string
  riskLevel: string
  description: string
  requestedBy: string
  requestedByName: string
  status: ApprovalStatus
  resolvedBy: string | null
  resolvedByName: string | null
  resolvedAt: string | null
  comment: string | null
  expiresAt: string
  payload: Record<string, unknown>
  createdAt: string
}

export interface ResolveApprovalInput {
  status: ApprovalStatus.APPROVED | ApprovalStatus.REJECTED
  comment?: string | null
}

export interface AgentCardProps {
  config: TenantAgentConfig
  onEdit: (config: TenantAgentConfig) => void
  onToggle: (agentId: string, enabled: boolean) => void
  availableConnectors: AvailableAiConnector[]
  t: (key: string) => string
}

export interface OsintSourceCardProps {
  source: OsintSourceConfig
  onEdit: (source: OsintSourceConfig) => void
  onDelete: (source: OsintSourceConfig) => void
  onTest: (sourceId: string) => void
  testLoading: boolean
  t: (key: string) => string
}

export interface ApprovalCardProps {
  approval: ApprovalRequest
  onResolve: (id: string, data: ResolveApprovalInput) => void
  resolveLoading: boolean
  t: (key: string) => string
}

export interface AgentConfigEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  config: TenantAgentConfig | null
  onSubmit: (agentId: string, data: UpdateAgentConfigInput) => void
  loading: boolean
  availableConnectors: AvailableAiConnector[]
  t: (key: string) => string
}

export interface OsintSourceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  source: OsintSourceConfig | null
  onSubmit: (data: CreateOsintSourceInput | UpdateOsintSourceInput) => void
  loading: boolean
  t: (key: string) => string
}
