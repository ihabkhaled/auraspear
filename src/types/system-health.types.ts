import type { HealthCheckStatus, MetricType, ServiceType, SortOrder } from '@/enums'

export interface SystemHealthCheck {
  id: string
  tenantId: string
  serviceType: ServiceType
  status: HealthCheckStatus
  responseTimeMs: number | null
  message: string | null
  version: string | null
  checkedAt: string
}

export interface SystemMetric {
  id: string
  tenantId: string
  serviceType: ServiceType
  metricType: MetricType
  value: number
  unit: string
  recordedAt: string
}

export interface SystemHealthStats {
  totalServices: number
  healthy: number
  degraded: number
  down: number
  avgResponseTimeMs: number | null
}

export interface HealthCheckSearchParams {
  page?: number
  limit?: number
  serviceType?: string
  status?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export interface MetricSearchParams {
  page?: number
  limit?: number
  serviceType?: string
  metricType?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export interface CreateHealthCheckFormValues {
  serviceName: string
  serviceType: ServiceType
  config: string
}

export interface EditHealthCheckFormValues {
  serviceName: string
  serviceType: ServiceType
  config: string
}

export interface SystemHealthCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateHealthCheckFormValues) => void
  loading?: boolean
}

export interface SystemHealthEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EditHealthCheckFormValues) => void
  initialValues: EditHealthCheckFormValues
  loading?: boolean
}

export interface SystemHealthDeleteDialogProps {
  serviceName: string
  onConfirm: () => void
  loading?: boolean
}

export interface SystemHealthKpiCardsProps {
  stats: SystemHealthStats | undefined
  isLoading: boolean
}

export interface SystemHealthFiltersProps {
  serviceTypeFilter: string
  statusFilter: string
  onServiceTypeChange: (value: string) => void
  onStatusChange: (value: string) => void
}

export interface SystemHealthDetailPanelProps {
  healthCheck: SystemHealthCheck | null
  metrics: SystemMetric[]
  open: boolean
  onOpenChange: (open: boolean) => void
}
