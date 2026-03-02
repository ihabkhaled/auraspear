import type { IntegrationStatus, UserRole, UserStatus, ServiceStatus, SortOrder } from '@/enums'

export interface TenantUserTableProps {
  users: TenantUser[]
  loading?: boolean
  onUserClick?: (user: TenantUser) => void
  onEditUser?: (user: TenantUser) => void
  onRemoveUser?: (user: TenantUser) => void
  onBlockUser?: (user: TenantUser) => void
  onUnblockUser?: (user: TenantUser) => void
  onRestoreUser?: (user: TenantUser) => void
  showActions?: boolean
  callerRole?: UserRole | undefined
  currentUserId?: string | undefined
  sortBy?: string | undefined
  sortOrder?: SortOrder | undefined
  onSort?: ((key: string, order: SortOrder) => void) | undefined
}

export interface Tenant {
  id: string
  name: string
  slug: string
  userCount: number
  alertCount: number
  caseCount: number
  createdAt: string
}

export interface TenantUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  lastLoginAt: string | null
  mfaEnabled: boolean
  isProtected: boolean
  avatar?: string
}

export interface ServiceHealth {
  name: string
  type: string
  status: ServiceStatus
  latencyMs: number
}

export interface AuditLogEntry {
  id: string
  createdAt: string
  actor: string
  action: string
  resource: string
  resourceId: string | null
  ipAddress: string | null
  details?: string | null
}

export interface AuditLogTableProps {
  logs: AuditLogEntry[]
  loading?: boolean
  sortBy?: string | undefined
  sortOrder?: SortOrder | undefined
  onSort?: ((key: string, order: SortOrder) => void) | undefined
}

export interface IntegrationConfig {
  id: string
  name: string
  description: string
  status: IntegrationStatus
  configFields?: Record<string, string>
}

export interface AuditLogParams {
  page?: number
  limit?: number
  actor?: string
  action?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export interface TenantUserListParams {
  sortBy?: string
  sortOrder?: SortOrder
  role?: string
  status?: string
}

export interface CreateTenantInput {
  name: string
  slug: string
}

export interface AddUserInput {
  email: string
  name: string
  password: string
  role: string
}

/** Lightweight user info returned by GET /members for assignee pickers. */
export interface TenantMember {
  id: string
  name: string
  email: string
}
