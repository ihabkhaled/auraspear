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
import type { TenantMember } from './admin.types'
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
  createdByName: string | null
  createdAt: string
  updatedAt: string
  closedAt: string | null
  linkedAlerts: string[]
  cycleId: string | null
  timeline: CaseTimelineEntry[]
  tasks: CaseTask[]
  artifacts: CaseArtifact[]
  tenantId: string
  tenantName: string
}

export interface CreateCaseInput {
  title: string
  description: string
  severity: CaseSeverity
  ownerUserId?: string
  linkedAlertIds?: string[]
  cycleId?: string
}

export interface UpdateCaseInput {
  title?: string
  description?: string
  severity?: CaseSeverity
  ownerUserId?: string | null
  cycleId?: string | null
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
  cycleId?: string
  ownerUserId?: string
}

export interface CaseListTableProps {
  cases: Case[]
  onCaseClick?: (caseItem: Case) => void
  loading?: boolean
  sortBy?: string | undefined
  sortOrder?: SortOrder | undefined
  onSort?: ((key: string, order: SortOrder) => void) | undefined
  currentUserId?: string | undefined
  isAdmin?: boolean | undefined
}

export interface CreateCaseFormValues {
  title: string
  description: string
  severity: CaseSeverity
  assignee?: string | undefined
  cycleId?: string | undefined
}

export interface CreateCaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateCaseFormValues) => void
  assigneeOptions: SelectOption[]
  cycleOptions?: SelectOption[]
  loading?: boolean
}

export interface CaseDetailHeaderProps {
  caseItem: Case
  ownerName?: string | undefined
  members?: TenantMember[] | undefined
  cycles?: CaseCycleOption[] | undefined
  onEdit?: () => void
  onDelete?: () => void
  onEscalate?: () => void
  onStatusChange?: (status: CaseStatus) => void
  onAssigneeChange?: (userId: string | null) => void
  onCycleChange?: (cycleId: string | null) => void
}

export interface CaseCycleOption {
  id: string
  name: string
  status: string
}

export interface CaseKanbanCardProps {
  caseItem: Case
  onClick?: ((caseItem: Case) => void) | undefined
  currentUserId?: string | undefined
  isAdmin?: boolean | undefined
}

export interface EditCaseFormValues {
  title: string
  description: string
  severity: CaseSeverity
}

export interface EditCaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EditCaseFormValues) => void
  initialValues: EditCaseFormValues
  loading?: boolean
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
