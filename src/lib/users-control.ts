import { UserRole, UserSessionStatus, UserStatus, type UsersControlUserSortField } from '@/enums'
import { USERS_CONTROL_SORT_FIELDS } from '@/lib/constants/users-control'
import type { UsersControlUser } from '@/types'

export function isUsersControlSortField(value: string): value is UsersControlUserSortField {
  return USERS_CONTROL_SORT_FIELDS.has(value)
}

export function getUsersControlPresenceClass(isOnline: boolean): string {
  return isOnline
    ? 'border-status-success/30 bg-status-success/10 text-status-success'
    : 'border-border bg-muted text-muted-foreground'
}

export function getUsersControlPresenceLabelKey(isOnline: boolean): string {
  return isOnline ? 'online' : 'offline'
}

export function getUsersControlMembershipStatusClass(status: UserStatus | null): string {
  switch (status) {
    case UserStatus.ACTIVE:
      return 'border-status-success/30 bg-status-success/10 text-status-success'
    case UserStatus.SUSPENDED:
      return 'border-status-warning/30 bg-status-warning/10 text-status-warning'
    case UserStatus.INACTIVE:
      return 'border-status-error/30 bg-status-error/10 text-status-error'
    default:
      return 'border-border bg-muted text-muted-foreground'
  }
}

export function getUsersControlMembershipStatusLabelKey(status: UserStatus | null): string {
  switch (status) {
    case UserStatus.ACTIVE:
      return 'membershipStatus.active'
    case UserStatus.SUSPENDED:
      return 'membershipStatus.suspended'
    case UserStatus.INACTIVE:
      return 'membershipStatus.inactive'
    default:
      return 'membershipStatus.unknown'
  }
}

export function getUsersControlSessionStatusClass(status: UserSessionStatus): string {
  switch (status) {
    case UserSessionStatus.ACTIVE:
      return 'border-status-success/30 bg-status-success/10 text-status-success'
    case UserSessionStatus.REVOKED:
      return 'border-status-warning/30 bg-status-warning/10 text-status-warning'
    case UserSessionStatus.EXPIRED:
      return 'border-status-error/30 bg-status-error/10 text-status-error'
    default:
      return 'border-border bg-muted text-muted-foreground'
  }
}

export function getUsersControlSessionStatusLabelKey(status: UserSessionStatus): string {
  switch (status) {
    case UserSessionStatus.ACTIVE:
      return 'sessionStatus.active'
    case UserSessionStatus.REVOKED:
      return 'sessionStatus.revoked'
    case UserSessionStatus.EXPIRED:
      return 'sessionStatus.expired'
    default:
      return 'sessionStatus.expired'
  }
}

export function canManageUsersControlTarget(
  actorRole: UserRole | null | undefined,
  targetUser: UsersControlUser
): boolean {
  if (actorRole === UserRole.GLOBAL_ADMIN) {
    return true
  }

  if (actorRole !== UserRole.TENANT_ADMIN) {
    return false
  }

  return !targetUser.isProtected && !targetUser.hasGlobalAdminMembership
}

export function isUsersControlAssignableRole(
  role: UserRole,
  permission: string,
  protectedPermissions: ReadonlySet<string>
): boolean {
  if (!protectedPermissions.has(permission)) {
    return true
  }

  return role === UserRole.TENANT_ADMIN
}
