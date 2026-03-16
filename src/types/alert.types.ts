import type {
  AlertSeverity,
  AlertStatus,
  AlertTimelineEventType,
  SortOrder,
  TimeRange,
} from '@/enums'

export interface Alert {
  id: string
  externalId: string | null
  title: string
  timestamp: string
  severity: AlertSeverity
  status: AlertStatus
  source: string
  ruleName: string
  ruleId: string
  description: string
  agentName: string
  agentId: string
  sourceIp: string
  destinationIp: string
  mitreTactics: string[]
  mitreTechniques: string[]
  rawEvent: Record<string, unknown> | null
  acknowledgedBy: string | null
  acknowledgedAt: string | null
  resolution: string | null
  closedBy: string | null
  closedAt: string | null
  createdAt: string
  updatedAt: string
  tenantId: string
}

export interface AlertSearchParams {
  page?: number
  limit?: number
  severity?: string
  status?: string
  query?: string
  timeRange?: TimeRange
  agentName?: string
  ruleGroup?: string
  source?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export interface AIInvestigation {
  result: string
  reasoning: string[]
  confidence: number
  model: string
  tokensUsed: {
    input: number
    output: number
  }
}

export interface SeverityCount {
  severity: AlertSeverity
  count: number
}

export interface AlertColumnTranslations {
  alerts: (key: string) => string
  common: (key: string) => string
}

export interface GetAlertColumnsOptions {
  onView?: (alert: Alert) => void
  onInvestigate?: (alert: Alert) => void
  onCreateCase?: (alert: Alert) => void
  onCopyId?: (id: string) => void
}

export interface AlertDetailDrawerProps {
  alert: Alert | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onInvestigate?: (alert: Alert) => void
  onCreateCase?: (alert: Alert) => void
  onEscalateToIncident?: (alert: Alert) => void
  onClose?: (alert: Alert) => void
}

export interface AlertFilterSidebarProps {
  timeRange: TimeRange
  onTimeRangeChange: (range: TimeRange) => void
  selectedSeverities: AlertSeverity[]
  onSeverityChange: (severities: AlertSeverity[]) => void
  severityCounts: SeverityCount[]
  agentFilter: string
  onAgentFilterChange: (value: string) => void
  ruleGroup: string
  onRuleGroupChange: (value: string) => void
}

export interface AlertRowActionsProps {
  alert: Alert
  onView?: ((alert: Alert) => void) | undefined
  onInvestigate?: ((alert: Alert) => void) | undefined
  onCreateCase?: ((alert: Alert) => void) | undefined
  onCopyId?: ((id: string) => void) | undefined
}

export interface AIInvestigationModalProps {
  investigation: AIInvestigation | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface ParsedKQLQuery {
  query?: string
  severity?: string
  status?: string
  agentName?: string
  ruleGroup?: string
  source?: string
}

export interface KQLSearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onSavedSearches?: () => void
}

export interface BulkActionResult {
  succeeded: number
  failed: number
  errors: string[]
}

export interface BulkCloseInput {
  ids: string[]
  resolution: string
}

export interface AlertTimelineEvent {
  id: string
  type: AlertTimelineEventType
  timestamp: string
  actor: string | null
  detail: string | null
}

export interface AlertBulkActionBarProps {
  selectedCount: number
  onAcknowledge: () => void
  onClose: () => void
  onClear: () => void
  isAcknowledging: boolean
  isClosing: boolean
}

export interface AlertTimelineProps {
  alert: Alert
}

export interface EscalateToIncidentDialogProps {
  alert: Alert | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface EscalateFormValues {
  title: string
  description: string
  severity: string
  category: string
}

export interface SeverityCount {
  severity: AlertSeverity
  count: number
}

export interface AlertColumnTranslations {
  alerts: (key: string) => string
  common: (key: string) => string
}

export interface GetAlertColumnsOptions {
  onView?: (alert: Alert) => void
  onInvestigate?: (alert: Alert) => void
  onCreateCase?: (alert: Alert) => void
  onCopyId?: (id: string) => void
}
