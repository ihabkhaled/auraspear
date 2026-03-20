'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Toast, SweetAlertDialog, SweetAlertIcon } from '@/components/common'
import { Permission, UserRole } from '@/enums'
import type { SortOrder, UsersControlUserSortField } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import {
  USERS_CONTROL_DEFAULT_LIMIT,
  USERS_CONTROL_DEFAULT_SORT_FIELD,
  USERS_CONTROL_DEFAULT_SORT_ORDER,
  USERS_CONTROL_SESSION_LIMIT,
} from '@/lib/constants/users-control'
import { hasPermission } from '@/lib/permissions'
import { canManageUsersControlTarget, isUsersControlSortField } from '@/lib/users-control'
import { useAuthStore, useTenantStore } from '@/stores'
import type { UsersControlUser } from '@/types'
import { useDebounce } from './useDebounce'
import { usePagination } from './usePagination'
import {
  useControlledUserSessions,
  useControlledUsers,
  useForceLogoutAllControlledUsers,
  useForceLogoutControlledSession,
  useForceLogoutControlledUser,
  useUsersControlSummary,
} from './useUsersControl'

export function useUsersControlPage() {
  const t = useTranslations('admin.usersControl')
  const tCommon = useTranslations('common')
  const tRoleSettings = useTranslations('roleSettings')
  const tErrors = useTranslations('errors')
  const locale = useLocale()
  const user = useAuthStore(s => s.user)
  const permissions = useAuthStore(s => s.permissions)
  const currentTenantId = useTenantStore(s => s.currentTenantId)
  const tenants = useTenantStore(s => s.tenants)

  const [overviewOpen, setOverviewOpen] = useState(true)
  const [usersOpen, setUsersOpen] = useState(true)
  const [sessionsOpen, setSessionsOpen] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<UsersControlUserSortField>(USERS_CONTROL_DEFAULT_SORT_FIELD)
  const [sortOrder, setSortOrder] = useState<SortOrder>(USERS_CONTROL_DEFAULT_SORT_ORDER)
  const [selectedUserStateId, setSelectedUserStateId] = useState('')
  const sessionsSectionRef = useRef<HTMLDivElement | null>(null)

  const debouncedSearch = useDebounce(search, 400)
  const usersPagination = usePagination({ initialLimit: USERS_CONTROL_DEFAULT_LIMIT })
  const sessionsPagination = usePagination({ initialLimit: USERS_CONTROL_SESSION_LIMIT })
  const { resetPage: resetUsersPage } = usersPagination

  const canViewSessions = hasPermission(permissions, Permission.USERS_CONTROL_VIEW_SESSIONS)
  const canForceLogoutUser = hasPermission(permissions, Permission.USERS_CONTROL_FORCE_LOGOUT)
  const canForceLogoutAll = hasPermission(permissions, Permission.USERS_CONTROL_FORCE_LOGOUT_ALL)

  const summaryQuery = useUsersControlSummary(true)
  const usersQuery = useControlledUsers(
    {
      page: usersPagination.page,
      limit: usersPagination.limit,
      ...(debouncedSearch.length > 0 ? { search: debouncedSearch } : {}),
      sortBy,
      sortOrder,
    },
    true
  )

  const selectedUser = useMemo(() => {
    const availableUsers = usersQuery.data?.data ?? []
    if (availableUsers.length === 0) {
      return null
    }

    const matchingUser =
      selectedUserStateId.length > 0
        ? (availableUsers.find(userItem => userItem.id === selectedUserStateId) ?? null)
        : null

    return matchingUser ?? availableUsers[0] ?? null
  }, [selectedUserStateId, usersQuery.data?.data])

  const selectedUserId = selectedUser?.id ?? ''
  const sessionsQuery = useControlledUserSessions(
    selectedUserId,
    {
      page: sessionsPagination.page,
      limit: sessionsPagination.limit,
    },
    canViewSessions
  )

  const forceLogoutUserMutation = useForceLogoutControlledUser()
  const forceLogoutSessionMutation = useForceLogoutControlledSession()
  const forceLogoutAllMutation = useForceLogoutAllControlledUsers()

  useEffect(() => {
    if (usersQuery.data?.pagination) {
      usersPagination.setTotal(usersQuery.data.pagination.total)
    }
  }, [usersPagination, usersQuery.data?.pagination])

  useEffect(() => {
    if (sessionsQuery.data?.pagination) {
      sessionsPagination.setTotal(sessionsQuery.data.pagination.total)
    }
  }, [sessionsPagination, sessionsQuery.data?.pagination])

  useEffect(() => {
    resetUsersPage()
  }, [debouncedSearch, resetUsersPage])

  const scopeLabel = useMemo(() => {
    if (user?.role === UserRole.GLOBAL_ADMIN) {
      return t('scope.system')
    }

    const scopedTenant = tenants.find(tenant => tenant.id === currentTenantId)
    return scopedTenant?.name ?? user?.tenantSlug ?? t('scope.currentTenant')
  }, [currentTenantId, t, tenants, user?.role, user?.tenantSlug])

  const handleSort = useCallback(
    (key: string, nextSortOrder: SortOrder) => {
      if (!isUsersControlSortField(key)) {
        return
      }

      setSortBy(key)
      setSortOrder(nextSortOrder)
      usersPagination.resetPage()
    },
    [usersPagination]
  )

  const handleUserSelect = useCallback(
    (nextUser: UsersControlUser) => {
      setSelectedUserStateId(nextUser.id)
      sessionsPagination.resetPage()
      setSessionsOpen(true)

      if (typeof window !== 'undefined') {
        window.requestAnimationFrame(() => {
          sessionsSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        })
      }
    },
    [sessionsPagination]
  )

  const canManageTargetUser = useCallback(
    (targetUser: UsersControlUser): boolean => canManageUsersControlTarget(user?.role, targetUser),
    [user?.role]
  )

  const canManageSelectedUser = selectedUser === null ? false : canManageTargetUser(selectedUser)

  const handleForceLogoutUser = useCallback(
    async (targetUser: UsersControlUser) => {
      const confirmed = await SweetAlertDialog.show({
        title: t('confirmForceLogoutUserTitle'),
        text: t('confirmForceLogoutUserText', { name: targetUser.email }),
        icon: SweetAlertIcon.WARNING,
      })

      if (confirmed) {
        forceLogoutUserMutation.mutate(targetUser.id, {
          onSuccess: response => {
            Toast.success(
              t('forceLogoutUserSuccess', {
                count: String(response.data.revokedSessions),
              })
            )
          },
          onError: (error: unknown) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        })
      }
    },
    [forceLogoutUserMutation, t, tErrors]
  )

  const handleForceLogoutAll = useCallback(async () => {
    const confirmed = await SweetAlertDialog.show({
      title: t('confirmForceLogoutAllTitle'),
      text: t('confirmForceLogoutAllText', { scope: scopeLabel }),
      icon: SweetAlertIcon.WARNING,
    })

    if (confirmed) {
      forceLogoutAllMutation.mutate(undefined, {
        onSuccess: response => {
          Toast.success(
            t('forceLogoutAllSuccess', {
              count: String(response.data.revokedSessions),
            })
          )
        },
        onError: (error: unknown) => {
          Toast.error(tErrors(getErrorKey(error)))
        },
      })
    }
  }, [forceLogoutAllMutation, scopeLabel, t, tErrors])

  const handleTerminateSession = useCallback(
    async (sessionId: string) => {
      if (!selectedUser) {
        return
      }

      const confirmed = await SweetAlertDialog.show({
        title: t('confirmTerminateSessionTitle'),
        text: t('confirmTerminateSessionText', { name: selectedUser.email }),
        icon: SweetAlertIcon.WARNING,
      })

      if (confirmed) {
        forceLogoutSessionMutation.mutate(
          { userId: selectedUser.id, sessionId },
          {
            onSuccess: response => {
              Toast.success(
                t('terminateSessionSuccess', {
                  count: String(response.data.revokedSessions),
                })
              )
            },
            onError: (error: unknown) => {
              Toast.error(tErrors(getErrorKey(error)))
            },
          }
        )
      }
    },
    [forceLogoutSessionMutation, selectedUser, t, tErrors]
  )

  return {
    t,
    tCommon,
    tRoleSettings,
    locale,
    overviewOpen,
    setOverviewOpen,
    usersOpen,
    setUsersOpen,
    sessionsOpen,
    setSessionsOpen,
    search,
    setSearch,
    sortBy,
    sortOrder,
    selectedUser,
    selectedUserId,
    sessionsSectionRef,
    scopeLabel,
    usersPagination,
    sessionsPagination,
    handleSort,
    handleUserSelect,
    handleForceLogoutUser,
    handleForceLogoutAll,
    handleTerminateSession,
    canManageTargetUser,
    canManageSelectedUser,
    canViewSessions,
    canForceLogoutUser,
    canForceLogoutAll,
    isForceLogoutUserPending: forceLogoutUserMutation.isPending,
    terminatingSessionId: forceLogoutSessionMutation.variables?.sessionId ?? '',
    isForceLogoutAllPending: forceLogoutAllMutation.isPending,
    summary: summaryQuery.data?.data,
    summaryLoading: summaryQuery.isLoading || summaryQuery.isFetching,
    summaryError: summaryQuery.isError,
    users: usersQuery.data?.data ?? [],
    usersLoading: usersQuery.isLoading || usersQuery.isFetching,
    usersError: usersQuery.isError,
    sessions: sessionsQuery.data?.data ?? [],
    sessionsLoading: sessionsQuery.isLoading || sessionsQuery.isFetching,
    sessionsError: sessionsQuery.isError,
  }
}
