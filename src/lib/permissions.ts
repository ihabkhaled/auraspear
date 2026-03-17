import { type Permission } from '@/enums'

export class PermissionError extends Error {
  readonly messageKey = 'errors.auth.insufficientPermissions'

  constructor(requiredPermission: Permission) {
    super(`Insufficient permissions: requires ${requiredPermission}`)
    this.name = 'PermissionError'
  }
}

export function hasPermission(permissions: string[], required: Permission): boolean {
  return permissions.includes(required)
}

export function hasAnyPermission(permissions: string[], required: Permission[]): boolean {
  return required.some(p => permissions.includes(p))
}

export function requirePermission(permissions: string[], required: Permission): void {
  if (!permissions.includes(required)) {
    throw new PermissionError(required)
  }
}
