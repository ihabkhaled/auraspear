import type { MlModelStatus, MlModelType, SortOrder, UebaEntityType, UebaRiskLevel } from '@/enums'

export interface UebaEntity {
  id: string
  tenantId: string
  entityType: UebaEntityType
  entityName: string
  riskScore: number
  riskLevel: UebaRiskLevel
  anomalyCount: number
  lastSeen: string
  department: string | null
  trend: number[]
  createdAt: string
  updatedAt: string
}

export interface UebaAnomaly {
  id: string
  tenantId: string
  entityId: string
  entityName: string
  entityType: UebaEntityType
  anomalyType: string
  description: string
  severity: UebaRiskLevel
  score: number
  detectedAt: string
  isResolved: boolean
}

export interface MlModel {
  id: string
  tenantId: string
  name: string
  modelType: MlModelType
  status: MlModelStatus
  accuracy: number
  lastTrainedAt: string | null
  dataPointsProcessed: number
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface UebaStats {
  totalEntities: number
  criticalRisk: number
  highRisk: number
  anomalies24h: number
  activeModels: number
}

export interface UebaEntitySearchParams {
  page?: number
  limit?: number
  query?: string
  entityType?: string
  riskLevel?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export interface UebaAnomalySearchParams {
  page?: number
  limit?: number
  query?: string
  severity?: string
}

export interface MlModelSearchParams {
  page?: number
  limit?: number
  query?: string
  status?: string
  modelType?: string
}

export interface CreateUebaEntityFormValues {
  entityName: string
  entityType: UebaEntityType
  department: string
}

export interface EditUebaEntityFormValues {
  entityName: string
  entityType: UebaEntityType
  department: string
}

export interface UebaEntityCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateUebaEntityFormValues) => void
  loading?: boolean
}

export interface UebaEntityEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EditUebaEntityFormValues) => void
  initialValues: EditUebaEntityFormValues
  loading?: boolean
}

export interface UebaEntityDeleteDialogProps {
  entityName: string
  anomalyCount: number
  onConfirm: () => void
}

export interface UebaEntityDetailPanelProps {
  entityId: string | null
  onClose: () => void
}

export interface UebaKpiCardsProps {
  stats: UebaStats | null
}

export interface UebaFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  entityTypeFilter: string
  onEntityTypeChange: (value: string) => void
  riskLevelFilter: string
  onRiskLevelChange: (value: string) => void
}

export interface UebaAnomalyCardProps {
  anomaly: UebaAnomaly
  onResolve: (id: string) => void
  resolving: boolean
}

export interface UebaMlModelCardProps {
  model: MlModel
}
