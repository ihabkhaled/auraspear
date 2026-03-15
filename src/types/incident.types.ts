import type {
  IncidentActorType,
  IncidentCategory,
  IncidentSeverity,
  IncidentStatus,
  SortOrder,
} from '@/enums'

export interface Incident {
  id: string
  tenantId: string
  incidentNumber: string
  title: string
  description: string | null
  severity: IncidentSeverity
  status: IncidentStatus
  category: IncidentCategory
  assigneeId: string | null
  assigneeName: string | null
  assigneeEmail: string | null
  linkedAlertIds: string[]
  linkedCaseId: string | null
  mitreTactics: string[]
  mitreTechniques: string[]
  createdBy: string
  createdByName: string | null
  tenantName: string
  resolvedAt: string | null
  createdAt: string
  updatedAt: string
  timeline: IncidentTimelineEntry[]
}

export interface IncidentTimelineEntry {
  id: string
  incidentId: string
  event: string
  actorType: IncidentActorType
  actorName: string
  timestamp: string
}

export interface IncidentStats {
  open: number
  inProgress: number
  contained: number
  resolved30d: number
  avgResolveHours: number | null
}

export interface IncidentSearchParams {
  page?: number
  limit?: number
  severity?: string
  status?: string
  category?: string
  query?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export interface CreateIncidentFormValues {
  title: string
  description: string
  severity: IncidentSeverity
  category: IncidentCategory
  assigneeId?: string | undefined
  mitreTechniques?: string | undefined
}

export interface EditIncidentFormValues {
  title: string
  description: string
  severity: IncidentSeverity
  category: IncidentCategory
  status: IncidentStatus
  assigneeId?: string | undefined
  mitreTechniques?: string | undefined
}

export interface IncidentCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateIncidentFormValues) => void
  assigneeOptions: Array<{ value: string; label: string }>
  loading?: boolean
}

export interface IncidentEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EditIncidentFormValues) => void
  initialValues: EditIncidentFormValues
  assigneeOptions: Array<{ value: string; label: string }>
  loading?: boolean
}

export interface IncidentDeleteDialogProps {
  incidentNumber: string
  title: string
  onConfirm: () => void
  loading?: boolean
}

export interface IncidentKpiCardsProps {
  stats: IncidentStats | undefined
  isLoading: boolean
}

export interface IncidentFiltersProps {
  searchQuery: string
  statusFilter: string
  severityFilter: string
  categoryFilter: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onSeverityChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onClearAll: () => void
}

export interface IncidentTimelineProps {
  incidentId: string
}

export interface IncidentDetailPanelProps {
  incident: Incident | null
  open: boolean
  onOpenChange: (open: boolean) => void
}
