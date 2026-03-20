import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { Permission } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { hasPermission, requirePermission } from '@/lib/permissions'
import {
  canAssignRoleSettingsPermission,
  canResetRoleSettings,
  canToggleRoleSettingsPermission,
  filterRoleSettingsPermissionGroups,
  isRoleSettingsToggleDisabled,
} from '@/lib/role-settings'
import { roleSettingsService } from '@/services'
import { useAuthStore } from '@/stores'
import type { PermissionDefinition, PermissionGroup } from '@/types'

/**
 * Build permission groups from the DB-backed permission definitions.
 * Groups by `module`, preserving sortOrder within each group.
 * Returns empty array if definitions is undefined/null.
 */
function buildGroups(definitions: PermissionDefinition[] | undefined | null): PermissionGroup[] {
  if (!definitions) return []

  const groupMap = new Map<string, PermissionGroup>()

  for (const def of definitions) {
    let group = groupMap.get(def.module)
    if (!group) {
      group = {
        key: def.module,
        labelKey: `roleSettings.modules.${def.module}`,
        permissions: [],
      }
      groupMap.set(def.module, group)
    }
    group.permissions.push(def.key)
  }

  return [...groupMap.values()]
}

/**
 * Build a map from permission key to its i18n labelKey from DB definitions.
 * Returns empty record if definitions is undefined/null.
 */
function buildLabelMap(
  definitions: PermissionDefinition[] | undefined | null
): Record<string, string> {
  if (!definitions) return {}

  const map: Record<string, string> = {}
  for (const def of definitions) {
    Reflect.set(map, def.key, def.labelKey)
  }
  return map
}

export function useRoleSettingsPage() {
  const t = useTranslations()
  const tErrors = useTranslations('errors')
  const queryClient = useQueryClient()
  const permissions = useAuthStore(s => s.permissions)
  const actorRole = useAuthStore(s => s.user?.role)

  const canEditRoles = hasPermission(permissions, Permission.ROLE_SETTINGS_UPDATE)
  const canResetDefaults = canResetRoleSettings(actorRole, canEditRoles)

  const [localMatrix, setLocalMatrix] = useState<Record<string, string[]>>({})
  const [isDirty, setIsDirty] = useState(false)

  // Fetch permission definitions from backend (dynamic)
  const { data: definitions, isLoading: isLoadingDefs } = useQuery({
    queryKey: ['role-settings', 'definitions'],
    queryFn: () => roleSettingsService.getPermissionDefinitions(),
    select: response => response.data,
  })

  // Fetch current permission matrix + configurable roles from backend
  const {
    data: matrixResponse,
    isLoading: isLoadingMatrix,
    isFetching,
  } = useQuery({
    queryKey: ['role-settings'],
    queryFn: () => roleSettingsService.getPermissionMatrix(),
    select: response => response.data,
  })

  const data = matrixResponse?.matrix
  const configurableRoles: string[] = useMemo(
    () => matrixResponse?.configurableRoles ?? [],
    [matrixResponse?.configurableRoles]
  )

  // Build permission groups from DB definitions
  const permissionGroups = useMemo(
    () => filterRoleSettingsPermissionGroups(buildGroups(definitions), actorRole),
    [actorRole, definitions]
  )

  // Build permission key → labelKey map from DB definitions
  const permissionLabelMap = useMemo(() => buildLabelMap(definitions), [definitions])

  // Initialize local matrix from server data
  const serverMatrix = data
  if (serverMatrix && !isDirty) {
    const needsUpdate = configurableRoles.some((role: string) => {
      const local = Reflect.get(localMatrix, role) as string[] | undefined
      const server = Reflect.get(serverMatrix, role) as string[] | undefined
      if (!local && server) return true
      if (!local || !server) return false
      if (local.length !== server.length) return true
      return local.some((p, i) => p !== server.at(i))
    })
    if (needsUpdate) {
      setLocalMatrix({ ...serverMatrix })
    }
  }

  const handleToggle = useCallback(
    (role: string, permission: string, checked: boolean) => {
      if (
        !canToggleRoleSettingsPermission(actorRole, permission) ||
        !canAssignRoleSettingsPermission(role, permission)
      ) {
        return
      }

      setLocalMatrix(prev => {
        const existing = Reflect.get(prev, role) as string[] | undefined
        const rolePermissions = [...(existing ?? [])]

        if (checked) {
          if (!rolePermissions.includes(permission)) {
            rolePermissions.push(permission)
          }
        } else {
          const idx = rolePermissions.indexOf(permission)
          if (idx !== -1) {
            rolePermissions.splice(idx, 1)
          }
        }

        return { ...prev, [role]: rolePermissions }
      })
      setIsDirty(true)
    },
    [actorRole]
  )

  const isToggleDisabled = useCallback(
    (role: string, permission: string): boolean =>
      isRoleSettingsToggleDisabled(actorRole, role, permission),
    [actorRole]
  )

  const updateMutation = useMutation({
    mutationFn: (matrix: Record<string, string[]>) => {
      requirePermission(permissions, Permission.ROLE_SETTINGS_UPDATE)
      return roleSettingsService.updatePermissionMatrix(matrix)
    },
    onSuccess: response => {
      setLocalMatrix({ ...response.data.matrix })
      setIsDirty(false)
      void queryClient.invalidateQueries({ queryKey: ['role-settings'] })
      Toast.success(t('roleSettings.saved'))
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
    },
  })

  const resetMutation = useMutation({
    mutationFn: () => {
      requirePermission(permissions, Permission.ROLE_SETTINGS_UPDATE)
      return roleSettingsService.resetToDefaults()
    },
    onSuccess: response => {
      setLocalMatrix({ ...response.data.matrix })
      setIsDirty(false)
      void queryClient.invalidateQueries({ queryKey: ['role-settings'] })
      Toast.success(t('roleSettings.resetSuccess'))
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
    },
  })

  const handleSave = useCallback(() => {
    updateMutation.mutate(localMatrix)
  }, [localMatrix, updateMutation])

  const handleReset = useCallback(() => {
    resetMutation.mutate()
  }, [resetMutation])

  const isChecked = useCallback(
    (role: string, permission: string): boolean => {
      const rolePermissions = Reflect.get(localMatrix, role) as string[] | undefined
      if (!rolePermissions) return false
      return rolePermissions.includes(permission)
    },
    [localMatrix]
  )

  return {
    t,
    isLoading: isLoadingDefs || isLoadingMatrix,
    isFetching,
    isDirty,
    isSaving: updateMutation.isPending,
    isResetting: resetMutation.isPending,
    permissionGroups,
    permissionLabelMap,
    configurableRoles,
    handleToggle,
    handleSave,
    handleReset,
    isChecked,
    isToggleDisabled,
    canEditRoles,
    canResetDefaults,
  }
}
