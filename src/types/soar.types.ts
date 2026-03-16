import type { SoarPlaybookStatus, SoarTriggerType, SoarExecutionStatus, SortOrder } from '@/enums'

export interface SoarPlaybook {
  id: string
  tenantId: string
  name: string
  description: string | null
  status: SoarPlaybookStatus
  triggerType: SoarTriggerType
  stepsCount: number
  lastExecutedAt: string | null
  executionCount: number
  avgDurationSeconds: number | null
  createdBy: string
  createdByName: string | null
  createdAt: string
  updatedAt: string
}

export interface SoarExecution {
  id: string
  playbookId: string
  playbookName: string
  status: SoarExecutionStatus
  triggeredBy: string
  triggeredByName: string | null
  triggerType: SoarTriggerType
  stepsCompleted: number
  totalSteps: number
  durationSeconds: number | null
  errorMessage: string | null
  startedAt: string
  completedAt: string | null
}

export interface SoarStats {
  totalPlaybooks: number
  activePlaybooks: number
  totalExecutions30d: number
  successRate: number | null
  avgDurationSeconds: number | null
}

export interface SoarPlaybookSearchParams {
  page?: number
  limit?: number
  status?: string
  triggerType?: string
  query?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export interface SoarExecutionSearchParams {
  page?: number
  limit?: number
  playbookId?: string
  status?: string
  query?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export interface CreateSoarPlaybookFormValues {
  name: string
  description: string
  triggerType: SoarTriggerType
  steps: string
  triggerConditions?: string
  cronExpression: string
}

export interface EditSoarPlaybookFormValues {
  name: string
  description: string
  triggerType: SoarTriggerType
  steps: string
  triggerConditions?: string
  cronExpression: string
}

export interface SoarCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateSoarPlaybookFormValues) => void
  loading?: boolean
}

export interface SoarEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EditSoarPlaybookFormValues) => void
  initialValues: EditSoarPlaybookFormValues
  loading?: boolean
}

export interface SoarDeleteDialogProps {
  playbookId: string | null
  playbookName: string
  onConfirm: (id: string) => void
}

export interface SoarRunDialogProps {
  playbookId: string | null
  playbookName: string
  onConfirm: (id: string) => void
}

export interface SoarDetailPanelProps {
  playbook: SoarPlaybook | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (playbook: SoarPlaybook) => void
  onDelete: (playbook: SoarPlaybook) => void
  onRun: (playbook: SoarPlaybook) => void
}

export interface SoarExecutionHistoryProps {
  playbookId: string | null
}

export interface SoarFiltersProps {
  searchQuery: string
  statusFilter: string
  triggerFilter: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onTriggerChange: (value: string) => void
}

export interface SoarKpiCardsProps {
  stats: SoarStats | undefined
}

export interface SoarColumnTranslations {
  soar: (key: string) => string
  common: (key: string) => string
}
