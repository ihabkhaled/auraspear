import type {
  CaseArtifactType,
  CaseSeverity,
  CaseSortField,
  CaseStatus,
  CaseTaskStatus,
  CaseTimelineEntryType,
  CaseViewMode,
  SortOrder,
} from '@/enums'
import type { SelectOption } from './common.types'

export interface CaseTask {
  id: string
  title: string
  status: CaseTaskStatus
  assignee: string
}

export interface CaseTimelineEntry {
  id: string
  timestamp: string
  type: CaseTimelineEntryType
  actor: string
  description: string
  metadata?: Record<string, unknown>
}

export interface CaseArtifact {
  id: string
  type: CaseArtifactType
  value: string
  source: string
}

export interface Case {
  id: string
  caseNumber: string
  title: string
  description: string
  status: CaseStatus
  severity: CaseSeverity
  ownerUserId: string | null
  ownerName: string | null
  ownerEmail: string | null
  createdBy: string | null
  createdAt: string
  updatedAt: string
  closedAt: string | null
  linkedAlerts: string[]
  timeline: CaseTimelineEntry[]
  tasks: CaseTask[]
  artifacts: CaseArtifact[]
  tenantId: string
}

export interface CreateCaseInput {
  title: string
  description: string
  severity: CaseSeverity
  ownerUserId?: string
  linkedAlertIds?: string[]
}

export interface UpdateCaseInput {
  title?: string
  description?: string
  severity?: CaseSeverity
  ownerUserId?: string
  status?: CaseStatus
}

export interface CaseSearchParams {
  page?: number
  limit?: number
  status?: string
  severity?: string
  query?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export interface CaseListTableProps {
  cases: Case[]
  onCaseClick?: (caseItem: Case) => void
  loading?: boolean
  sortBy?: string | undefined
  sortOrder?: SortOrder | undefined
  onSort?: ((key: string, order: SortOrder) => void) | undefined
}

export interface CreateCaseFormValues {
  title: string
  description: string
  severity: CaseSeverity
  assignee?: string | undefined
}

export interface CreateCaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateCaseFormValues) => void
  assigneeOptions: SelectOption[]
  loading?: boolean
}

export interface CaseDetailHeaderProps {
  caseItem: Case
  ownerName?: string | undefined
  onEdit?: () => void
  onDelete?: () => void
  onEscalate?: () => void
  onStatusChange?: (status: CaseStatus) => void
}

export interface CaseKanbanCardProps {
  caseItem: Case
  onClick?: ((caseItem: Case) => void) | undefined
}

export interface CaseDetailPageProps {
  params: Promise<{ id: string }>
}

export interface CaseToolbarProps {
  viewMode: CaseViewMode
  onViewModeChange: (mode: CaseViewMode) => void
  activeSeverityFilter: CaseSeverity | undefined
  onSeverityFilterChange: (severity: CaseSeverity | undefined) => void
  sortField: CaseSortField
  onSortFieldChange: (field: CaseSortField) => void
  sortOrder: SortOrder
  onSortOrderChange: (order: SortOrder) => void
}
