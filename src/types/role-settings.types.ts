import type { Permission } from '@/enums'

export interface PermissionMatrix {
  [role: string]: Permission[]
}

export interface RoleSettingsResponse {
  matrix: PermissionMatrix
  configurableRoles: string[]
}

export interface PermissionDefinition {
  key: string
  module: string
  labelKey: string
  sortOrder: number
}

export interface PermissionGroup {
  key: string
  labelKey: string
  permissions: string[]
}

export interface RoleSettingsMatrixProps {
  permissionGroups: PermissionGroup[]
  configurableRoles: string[]
  isChecked: (role: string, permission: string) => boolean
  onToggle: (role: string, permission: string, checked: boolean) => void
  disabled: boolean
  permissionLabelMap: Record<string, string>
  t: (key: string) => string
}
