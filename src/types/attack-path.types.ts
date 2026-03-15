import type { AttackPathSeverity, AttackPathStatus } from '@/enums'

export interface AttackPathStage {
  id: string
  name: string
  mitreId: string
  description: string
  assets: string[]
  order: number
}

export interface AttackPath {
  id: string
  tenantId: string
  pathNumber: string
  title: string
  description: string | null
  severity: AttackPathSeverity
  status: AttackPathStatus
  affectedAssets: number
  killChainPercentage: number
  mitreTechniques: string[]
  stages: AttackPathStage[]
  linkedIncidents: string[]
  affectedAssetNames: string[]
  detectedAt: string
  createdAt: string
  updatedAt: string
}

export interface AttackPathStats {
  activePaths: number
  assetsAtRisk: number
  killChainCoverage: number
  criticalPaths: number
}

export interface AttackPathSearchParams {
  page?: number
  limit?: number
  query?: string
  severity?: string
  status?: string
}

export interface AttackPathStageFormValue {
  name: string
  mitreId: string
  description: string
  assets: string[]
}

export interface CreateAttackPathFormValues {
  title: string
  description: string
  severity: AttackPathSeverity
  stages: AttackPathStageFormValue[]
  linkedIncidents: string
  affectedAssets: string
}

export interface EditAttackPathFormValues {
  title: string
  description: string
  severity: AttackPathSeverity
  status: AttackPathStatus
  stages: AttackPathStageFormValue[]
  linkedIncidents: string
  affectedAssets: string
}

export interface AttackPathKpiCardsProps {
  stats: AttackPathStats | null
  t: (key: string) => string
}

export interface AttackPathFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  severityFilter: string
  onSeverityChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  t: (key: string) => string
  tCommon: (key: string) => string
}

export interface AttackPathCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateAttackPathFormValues) => void
  loading?: boolean
}

export interface AttackPathEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EditAttackPathFormValues) => void
  initialValues: EditAttackPathFormValues
  loading?: boolean
}

export interface AttackPathDeleteDialogProps {
  pathTitle: string
  onConfirm: () => void
  t: (key: string) => string
}

export interface AttackPathDetailPanelProps {
  pathId: string
  onClose: () => void
  onEdit: (path: AttackPath) => void
  onDelete: (path: AttackPath) => void
  t: (key: string) => string
}

export interface AttackPathStageEditorProps {
  stages: AttackPathStageFormValue[]
  onAdd: () => void
  onRemove: (index: number) => void
  onMoveUp: (index: number) => void
  onMoveDown: (index: number) => void
  onStageChange: (index: number, field: string, value: string | string[]) => void
  t: (key: string, values?: Record<string, string | number>) => string
}

export interface AttackPathVisualizationProps {
  stages: AttackPathStage[]
  t: (key: string) => string
}
