import type { AlertSeverity, AlertStatus } from '@/enums'

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
  severity?: AlertSeverity[]
  status?: AlertStatus[]
  query?: string
  timeRange?: string
  agentId?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface AIInvestigation {
  alertId: string
  verdict: string
  confidence: number
  reasoning: string
  recommendations: string[]
  relatedAlerts: string[]
  mitreTechniques: string[]
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
