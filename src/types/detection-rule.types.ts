import type {
  DetectionRuleSeverity,
  DetectionRuleStatus,
  DetectionRuleType,
  SortOrder,
} from '@/enums'

export interface DetectionRule {
  id: string
  tenantId: string
  name: string
  description: string | null
  ruleType: DetectionRuleType
  severity: DetectionRuleSeverity
  status: DetectionRuleStatus
  matchCount: number
  falsePositiveRate: number
  mitreTactics: string[]
  mitreTechniques: string[]
  createdBy: string
  createdByName: string | null
  lastTriggeredAt: string | null
  createdAt: string
  updatedAt: string
}

export interface DetectionRuleStats {
  totalRules: number
  enabled: number
  disabled: number
  testing: number
  totalMatches30d: number
  avgFalsePositiveRate: number
}

export interface DetectionRuleSearchParams {
  page?: number
  limit?: number
  ruleType?: string
  severity?: string
  status?: string
  query?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export interface CreateDetectionRuleFormValues {
  name: string
  ruleType: DetectionRuleType
  severity: DetectionRuleSeverity
  conditions: string
  actions: string
}

export interface EditDetectionRuleFormValues {
  name: string
  ruleType: DetectionRuleType
  severity: DetectionRuleSeverity
  status: DetectionRuleStatus
  conditions: string
  actions: string
}

export interface DetectionRuleCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateDetectionRuleFormValues) => void
  loading?: boolean
}

export interface DetectionRuleEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EditDetectionRuleFormValues) => void
  initialValues: EditDetectionRuleFormValues
  loading?: boolean
}

export interface DetectionRuleDeleteDialogProps {
  ruleName: string
  onConfirm: () => void
  loading?: boolean
}

export interface DetectionRuleKpiCardsProps {
  stats: DetectionRuleStats | undefined
  isLoading: boolean
}

export interface DetectionRuleFiltersProps {
  searchQuery: string
  ruleTypeFilter: string
  severityFilter: string
  statusFilter: string
  onSearchChange: (value: string) => void
  onRuleTypeChange: (value: string) => void
  onSeverityChange: (value: string) => void
  onStatusChange: (value: string) => void
}

export interface DetectionRuleDetailPanelProps {
  rule: DetectionRule | null
  open: boolean
  onOpenChange: (open: boolean) => void
}
