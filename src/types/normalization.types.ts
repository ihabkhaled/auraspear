import type { NormalizationPipelineStatus, NormalizationSourceType, SortOrder } from '@/enums'

export interface NormalizationPipeline {
  id: string
  tenantId: string
  name: string
  description: string | null
  sourceType: NormalizationSourceType
  status: NormalizationPipelineStatus
  eventsProcessed: number
  errorRate: number
  lastRunAt: string | null
  createdBy: string
  createdByName: string | null
  createdAt: string
  updatedAt: string
}

export interface NormalizationStats {
  totalPipelines: number
  active: number
  inactive: number
  error: number
  totalEventsProcessed: number
  avgErrorRate: number
}

export interface NormalizationSearchParams {
  page?: number
  limit?: number
  sourceType?: string
  status?: string
  query?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export interface CreateNormalizationFormValues {
  name: string
  sourceType: NormalizationSourceType
  parserConfig: string
  fieldMappings: string
}

export interface EditNormalizationFormValues {
  name: string
  sourceType: NormalizationSourceType
  parserConfig: string
  fieldMappings: string
}

export interface NormalizationCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateNormalizationFormValues) => void
  loading?: boolean
}

export interface NormalizationEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EditNormalizationFormValues) => void
  initialValues: EditNormalizationFormValues
  loading?: boolean
}

export interface NormalizationDeleteDialogProps {
  pipelineName: string
  onConfirm: () => void
  loading?: boolean
}

export interface NormalizationKpiCardsProps {
  stats: NormalizationStats | undefined
  isLoading: boolean
}

export interface NormalizationFiltersProps {
  searchQuery: string
  sourceTypeFilter: string
  statusFilter: string
  onSearchChange: (value: string) => void
  onSourceTypeChange: (value: string) => void
  onStatusChange: (value: string) => void
}

export interface NormalizationDetailPanelProps {
  pipeline: NormalizationPipeline | null
  open: boolean
  onOpenChange: (open: boolean) => void
}
