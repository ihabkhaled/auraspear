import type {
  CloudAccountStatus,
  CloudFindingSeverity,
  CloudFindingStatus,
  CloudProvider,
  SortOrder,
} from '@/enums'

export interface CloudAccount {
  id: string
  tenantId: string
  name: string
  provider: CloudProvider
  accountId: string
  status: CloudAccountStatus
  regionsMonitored: string[]
  totalFindings: number
  criticalFindings: number
  lastScanAt: string | null
  createdBy: string
  createdByName: string | null
  createdAt: string
  updatedAt: string
}

export interface CloudFinding {
  id: string
  tenantId: string
  cloudAccountId: string
  cloudAccountName: string
  provider: CloudProvider
  resource: string
  region: string
  severity: CloudFindingSeverity
  status: CloudFindingStatus
  title: string
  description: string | null
  remediation: string | null
  detectedAt: string
  resolvedAt: string | null
}

export interface CloudSecurityStats {
  totalAccounts: number
  connected: number
  disconnected: number
  totalFindings: number
  criticalFindings: number
  highFindings: number
  openFindings: number
}

export interface CloudAccountSearchParams {
  page?: number
  limit?: number
  provider?: string
  status?: string
  query?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export interface CloudFindingSearchParams {
  page?: number
  limit?: number
  cloudAccountId?: string
  provider?: string
  severity?: string
  status?: string
  query?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export interface CreateCloudAccountFormValues {
  provider: CloudProvider
  accountId: string
  name: string
  region: string
}

export interface EditCloudAccountFormValues {
  provider: CloudProvider
  accountId: string
  name: string
  region: string
}

export interface CloudAccountCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateCloudAccountFormValues) => void
  loading?: boolean
}

export interface CloudAccountEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EditCloudAccountFormValues) => void
  initialValues: EditCloudAccountFormValues
  loading?: boolean
}

export interface CloudAccountDeleteDialogProps {
  accountName: string
  onConfirm: () => void
  loading?: boolean
}

export interface CloudSecurityKpiCardsProps {
  stats: CloudSecurityStats | undefined
  isLoading: boolean
}

export interface CloudSecurityFiltersProps {
  searchQuery: string
  providerFilter: string
  statusFilter: string
  onSearchChange: (value: string) => void
  onProviderChange: (value: string) => void
  onStatusChange: (value: string) => void
}

export interface CloudAccountDetailPanelProps {
  account: CloudAccount | null
  findings: CloudFinding[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface CloudFindingCardProps {
  finding: CloudFinding
  onResolve: (id: string) => void
  onSuppress: (id: string) => void
}
