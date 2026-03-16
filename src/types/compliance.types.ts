import type { ComplianceStandard, ComplianceControlStatus, SortOrder } from '@/enums'

export interface ComplianceFramework {
  id: string
  tenantId: string
  name: string
  standard: ComplianceStandard
  version: string
  description: string | null
  totalControls: number
  passedControls: number
  failedControls: number
  complianceScore: number | null
  lastAssessedAt: string | null
  createdBy: string
  createdByName: string | null
  createdAt: string
  updatedAt: string
}

export interface ComplianceControl {
  id: string
  frameworkId: string
  controlId: string
  title: string
  description: string | null
  status: ComplianceControlStatus
  evidence: string | null
  assessedAt: string | null
  assessedBy: string | null
  assessedByName: string | null
}

export interface ComplianceStats {
  totalFrameworks: number
  avgComplianceScore: number | null
  passedControls: number
  failedControls: number
  notAssessedControls: number
}

export interface ComplianceSearchParams {
  page?: number
  limit?: number
  standard?: string
  query?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export interface CreateComplianceFrameworkFormValues {
  name: string
  standard: ComplianceStandard
  version: string
  description: string
}

export interface EditComplianceFrameworkFormValues {
  name: string
  standard: ComplianceStandard
  version: string
  description: string
}

export interface EditComplianceControlFormValues {
  status: ComplianceControlStatus
  evidence: string
  notes: string
}

export interface ComplianceCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateComplianceFrameworkFormValues) => void
  loading?: boolean
}

export interface ComplianceEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EditComplianceFrameworkFormValues) => void
  initialValues: EditComplianceFrameworkFormValues
  loading?: boolean
}

export interface ComplianceDeleteDialogProps {
  frameworkId: string | null
  frameworkName: string
  onConfirm: (id: string) => void
}

export interface ComplianceDetailPanelProps {
  framework: ComplianceFramework | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (framework: ComplianceFramework) => void
  onDelete?: (framework: ComplianceFramework) => void
}

export interface ComplianceControlCardProps {
  control: ComplianceControl
  onAssess: (control: ComplianceControl) => void
}

export interface ComplianceControlEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EditComplianceControlFormValues) => void
  initialValues: EditComplianceControlFormValues
  controlTitle: string
  loading?: boolean
}

export interface ComplianceFiltersProps {
  searchQuery: string
  standardFilter: string
  onSearchChange: (value: string) => void
  onStandardChange: (value: string) => void
}

export interface ComplianceKpiCardsProps {
  stats: ComplianceStats | undefined
}

export interface ComplianceColumnTranslations {
  compliance: (key: string) => string
  common: (key: string) => string
}
