import { UserRole } from '@/enums'

/**
 * Role hierarchy — higher index = lower privilege.
 * A user can access resources at their level or below.
 */
const ROLE_HIERARCHY: UserRole[] = [
  UserRole.GLOBAL_ADMIN,
  UserRole.TENANT_ADMIN,
  UserRole.SOC_ANALYST_L2,
  UserRole.THREAT_HUNTER,
  UserRole.SOC_ANALYST_L1,
  UserRole.EXECUTIVE_READONLY,
]

/**
 * Check if `userRole` has at least the privilege of `requiredRole`.
 * Returns true if user's role is equal or higher in hierarchy.
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const userIndex = ROLE_HIERARCHY.indexOf(userRole)
  const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole)

  if (userIndex === -1 || requiredIndex === -1) {
    return false
  }

  return userIndex <= requiredIndex
}

/**
 * Route-to-minimum-role mapping.
 * Routes not listed here are accessible to all authenticated users.
 */
export const ROUTE_ROLE_MAP: Record<string, UserRole> = {
  '/alerts': UserRole.SOC_ANALYST_L1,
  '/hunt': UserRole.THREAT_HUNTER,
  '/cases': UserRole.SOC_ANALYST_L1,
  '/intel': UserRole.SOC_ANALYST_L1,
  '/connectors': UserRole.SOC_ANALYST_L2,
  '/admin/tenant': UserRole.TENANT_ADMIN,
  '/admin/system': UserRole.GLOBAL_ADMIN,
  '/dashboard': UserRole.SOC_ANALYST_L1,
  '/profile': UserRole.SOC_ANALYST_L1,
  '/settings': UserRole.SOC_ANALYST_L1,
}

/**
 * Check if `userRole` can access `pathname`.
 */
export function canAccessRoute(userRole: UserRole, pathname: string): boolean {
  for (const [route, requiredRole] of Object.entries(ROUTE_ROLE_MAP)) {
    if (pathname.startsWith(route)) {
      return hasRole(userRole, requiredRole)
    }
  }
  return true
}
