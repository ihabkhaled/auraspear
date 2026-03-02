import type { AlertSeverity, AlertStatus, SortOrder, TimeRange } from '@/enums'

export interface Alert {
  id: string
  timestamp: string
  severity: AlertSeverity
  status: AlertStatus
  ruleName: string
  ruleId: string
  description: string
  agentName: string
  agentId: string
  sourceIp: string
  destinationIp: string
  mitreTactics: string[]
  mitreTechniques: string[]
  rawEvent: Record<string, unknown>
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
