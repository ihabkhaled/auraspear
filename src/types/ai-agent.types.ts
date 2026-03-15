import type { AiAgentSessionStatus, AiAgentStatus, AiAgentTier, SortOrder } from '@/enums'

export interface AiAgent {
  id: string
  tenantId: string
  name: string
  model: string
  tier: AiAgentTier
  status: AiAgentStatus
  description: string | null
  soulMd: string | null
  totalTasks: number
  totalTokens: number
  totalCost: number
  totalSessions: number
  tools: string[]
  createdAt: string
  updatedAt: string
}

export interface AiAgentSession {
  id: string
  agentId: string
  status: AiAgentSessionStatus
  taskDescription: string
  tokensUsed: number
  cost: number
  startedAt: string
  completedAt: string | null
  result: string | null
}

export interface AiAgentStats {
  totalAgents: number
  onlineAgents: number
  totalSessions: number
  totalTokens: number
  totalCost: number
}

export interface AiAgentSearchParams {
  page?: number
  limit?: number
  query?: string
  status?: string
  tier?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export interface AiAgentSessionSearchParams {
  page?: number
  limit?: number
}

export interface AiAgentTool {
  id: string
  agentId: string
  name: string
  description: string
  schema: string
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateAiAgentFormValues {
  name: string
  description: string
  model: string
  tier: AiAgentTier
  soulMd: string
}

export interface EditAiAgentFormValues {
  name: string
  description: string
  model: string
  tier: AiAgentTier
  soulMd: string
}

export interface AiAgentToolFormValues {
  name: string
  description: string
  schema: string
  enabled: boolean
}

export interface AiAgentCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateAiAgentFormValues) => void
  loading?: boolean
}

export interface AiAgentEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EditAiAgentFormValues) => void
  initialValues: EditAiAgentFormValues
  loading?: boolean
}

export interface AiAgentDeleteDialogProps {
  agentName: string
  onConfirm: () => void
}

export interface AiAgentDetailPanelProps {
  agent: AiAgent
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export interface AiAgentToolDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: AiAgentToolFormValues) => void
  initialValues?: AiAgentToolFormValues
  loading?: boolean
}

export interface AiAgentSessionTableProps {
  agentId: string
}

export interface AiAgentKpiCardsProps {
  stats: AiAgentStats | null
}

export interface AiAgentFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  tierFilter: string
  onTierChange: (value: string) => void
  onCreateClick: () => void
}
