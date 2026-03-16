import type { ReportType, ReportFormat, ReportStatus, SortOrder } from '@/enums'

export interface Report {
  id: string
  tenantId: string
  name: string
  description: string | null
  type: ReportType
  format: ReportFormat
  status: ReportStatus
  parameters: Record<string, unknown> | null
  fileUrl: string | null
  fileSize: number | null
  generatedBy: string
  generatedByName: string | null
  generatedAt: string | null
  createdAt: string
}

export interface ReportStats {
  totalReports: number
  completedReports: number
  generatingReports: number
  failedReports: number
}

export interface ReportSearchParams {
  page?: number
  limit?: number
  type?: string
  format?: string
  status?: string
  query?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export interface CreateReportFormValues {
  name: string
  description: string
  type: ReportType
  format: ReportFormat
  parameters: string
}

export interface EditReportFormValues {
  name: string
  description: string
  type: ReportType
  format: ReportFormat
  parameters: string
}

export interface ReportCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateReportFormValues) => void
  loading?: boolean
}

export interface ReportEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EditReportFormValues) => void
  initialValues: EditReportFormValues
  loading?: boolean
}

export interface ReportDeleteDialogProps {
  reportId: string | null
  reportName: string
  onConfirm: (id: string) => void
}

export interface ReportDetailPanelProps {
  report: Report | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: () => void
  onDelete: () => void
}

export interface ReportFiltersProps {
  searchQuery: string
  typeFilter: string
  formatFilter: string
  statusFilter: string
  onSearchChange: (value: string) => void
  onTypeChange: (value: string) => void
  onFormatChange: (value: string) => void
  onStatusChange: (value: string) => void
}

export interface ReportKpiCardsProps {
  stats: ReportStats | undefined
}
