import type {
  DetectionRuleSeverity,
  DetectionRuleStatus,
  DetectionRuleType,
  SortOrder,
} from '@/enums'

export interface DetectionRule {
  id: string
  tenantId: string
  ruleNumber: string
  name: string
  description: string | null
  ruleType: DetectionRuleType
  severity: DetectionRuleSeverity
  status: DetectionRuleStatus
  conditions: Record<string, unknown>
  actions: Record<string, unknown>
  hitCount: number
  falsePositiveCount: number
  createdBy: string
  lastTriggeredAt: string | null
  createdAt: string
  updatedAt: string
}

export interface DetectionRuleStats {
  totalRules: number
  activeRules: number
  testingRules: number
  disabledRules: number
  totalMatches: number
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
  onEdit?: ((rule: DetectionRule) => void) | undefined
  onDelete?: ((rule: DetectionRule) => void) | undefined
  deleteLoading?: boolean
}

export interface DetectionRuleColumnTranslations {
  detectionRules: (key: string) => string
  common: (key: string) => string
}
