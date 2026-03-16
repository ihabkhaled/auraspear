import type { ReactNode } from 'react'
import type { RuleSeverity, RuleSource, RuleStatus, SortOrder } from '@/enums'

export interface CorrelationRule {
  id: string
  tenantId: string
  ruleNumber: string
  title: string
  description: string | null
  source: RuleSource
  severity: RuleSeverity
  status: RuleStatus
  yamlContent: string | null
  conditions: Record<string, unknown> | null
  mitreTactics: string[]
  mitreTechniques: string[]
  hitCount: number
  linkedIncidents: number
  createdBy: string
  createdByName: string | null
  tenantName: string
  lastFiredAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CorrelationStats {
  correlationRules: number
  sigmaRules: number
  fired24h: number
  linkedToIncidents: number
}

export interface CorrelationSearchParams {
  page?: number
  limit?: number
  source?: string
  severity?: string
  status?: string
  query?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export interface CorrelationKpiCardsProps {
  stats: CorrelationStats | null
}

export interface CorrelationFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  activeTab: string
  onTabChange: (tab: string) => void
  severityFilter: string
  onSeverityChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
}

export interface CorrelationCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CorrelationCreateFormValues) => void
  loading?: boolean
}

export interface CorrelationCreateFormValues {
  title: string
  description: string
  source: RuleSource
  severity: RuleSeverity
  status: RuleStatus
  mitreTechniques: string
  yamlContent: string
  conditions: string
}

export interface CorrelationEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CorrelationEditFormValues) => void
  rule: CorrelationRule | null
  loading?: boolean
}

export interface CorrelationEditFormValues {
  title: string
  description: string
  source: RuleSource
  severity: RuleSeverity
  status: RuleStatus
  mitreTechniques: string
  yamlContent: string
  conditions: string
}

export interface CorrelationDeleteDialogProps {
  rule: CorrelationRule | null
  onConfirm: (id: string) => void
  loading?: boolean
}

export interface CorrelationDetailPanelProps {
  rule: CorrelationRule | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (rule: CorrelationRule) => void
  onDelete: (rule: CorrelationRule) => void
  children?: ReactNode
}

export interface CorrelationColumnTranslations {
  correlation: (key: string) => string
}
