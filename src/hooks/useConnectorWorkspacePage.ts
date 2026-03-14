'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Toast, SweetAlertDialog, SweetAlertIcon } from '@/components/common'
import { type ConnectorType, UserRole, WorkspaceTab } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import {
  isConnectorType,
  CONNECTOR_ICONS,
  CONNECTOR_META,
} from '@/lib/constants/connectors.constants'
import { hasRole } from '@/lib/roles'
import { useAuthStore } from '@/stores'
import type { WorkspaceSearchRequest } from '@/types'
import {
  useConnector,
  useTestConnector,
  useDeleteConnector,
  useCreateConnector,
  useSyncConnector,
} from './useConnectors'
import {
  useWorkspaceOverview,
  useWorkspaceRecentActivity,
  useWorkspaceEntities,
  useWorkspaceSearch,
  useWorkspaceAction,
} from './useConnectorWorkspace'

export function useConnectorWorkspacePage(rawType: string) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('connectors')
  const tErrors = useTranslations()
  const [testing, setTesting] = useState(false)

  const isCreateMode = searchParams.get('create') === 'true'
  const initialTab = (searchParams.get('tab') ?? WorkspaceTab.OVERVIEW) as WorkspaceTab
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(initialTab)

  // Pagination state
  const [activityPage, setActivityPage] = useState(1)
  const [entitiesPage, setEntitiesPage] = useState(1)

  const { user } = useAuthStore()
  const userRole = user?.role
  const isEditor = userRole ? hasRole(userRole, UserRole.SOC_ANALYST_L2) : false
  const isAdmin = userRole ? hasRole(userRole, UserRole.TENANT_ADMIN) : false

  const isValidType = isConnectorType(rawType)
  const validType = isValidType ? (rawType as ConnectorType) : undefined
  const meta = validType ? CONNECTOR_META[validType] : undefined
  const Icon = validType ? CONNECTOR_ICONS[validType] : undefined

  // Connector config data
  const { data: connector, isLoading: connectorLoading } = useConnector(rawType, !isCreateMode)
  const testMutation = useTestConnector()
  const deleteMutation = useDeleteConnector()
  const createMutation = useCreateConnector()
  const syncMutation = useSyncConnector()

  // Workspace data (only if connector exists & not in create mode)
  const workspaceEnabled = isValidType && !isCreateMode && Boolean(connector?.enabled)

  const { data: overview, isFetching: overviewFetching } = useWorkspaceOverview(
    rawType,
    workspaceEnabled && activeTab === WorkspaceTab.OVERVIEW
  )

  const { data: recentActivity, isFetching: activityFetching } = useWorkspaceRecentActivity(
    rawType,
    activityPage,
    20,
    workspaceEnabled && activeTab === WorkspaceTab.DATA
  )

  const { data: entities, isFetching: entitiesFetching } = useWorkspaceEntities(
    rawType,
    entitiesPage,
    20,
    workspaceEnabled && activeTab === WorkspaceTab.DATA
  )

  const searchMutation = useWorkspaceSearch(rawType)
  const actionMutation = useWorkspaceAction(rawType)

  const handleTest = useCallback(() => {
    if (!isValidType || !meta) return
    setTesting(true)
    Toast.info(t('testingConnector', { name: meta.label }))
    testMutation.mutate(rawType, {
      onSuccess: result => {
        if (result.ok) {
          Toast.success(`${meta.label} ${t('connectedSuccessfully')}`)
        } else {
          Toast.error(result.details ?? t('connectionFailed'))
        }
      },
      onError: (error: unknown) => {
        Toast.error(tErrors(getErrorKey(error)))
      },
      onSettled: () => {
        setTesting(false)
      },
    })
  }, [isValidType, meta, rawType, testMutation, t, tErrors])

  const handleDelete = useCallback(async () => {
    if (!isValidType || !meta) return
    const confirmed = await SweetAlertDialog.show({
      text: t('confirmDelete'),
      icon: SweetAlertIcon.QUESTION,
    })
    if (!confirmed) return

    deleteMutation.mutate(rawType, {
      onSuccess: () => {
        Toast.success(`${meta.label} ${t('deleted')}`)
        router.push('/connectors')
      },
      onError: (error: unknown) => {
        Toast.error(tErrors(getErrorKey(error)))
      },
    })
  }, [isValidType, meta, rawType, deleteMutation, t, tErrors, router])

  const handleCreate = useCallback(
    (data: {
      type: string
      name: string
      enabled: boolean
      authType: string
      config: Record<string, unknown>
    }) => {
      createMutation.mutate(data, {
        onSuccess: () => {
          Toast.success(t('connectorCreated'))
          router.push('/connectors')
        },
        onError: (error: unknown) => {
          Toast.error(tErrors(getErrorKey(error)))
        },
      })
    },
    [createMutation, t, tErrors, router]
  )

  const handleSearch = useCallback(
    (request: WorkspaceSearchRequest) => {
      searchMutation.mutate(request, {
        onError: (error: unknown) => {
          Toast.error(tErrors(getErrorKey(error)))
        },
      })
    },
    [searchMutation, tErrors]
  )

  const handleSync = useCallback(() => {
    if (!isValidType || !meta) return
    Toast.info(t('syncStarted', { name: meta.label }))
    syncMutation.mutate(rawType, {
      onSuccess: result => {
        if (result.success) {
          Toast.success(result.message)
        } else {
          Toast.error(result.message)
        }
      },
      onError: (error: unknown) => {
        Toast.error(tErrors(getErrorKey(error)))
      },
    })
  }, [isValidType, meta, rawType, syncMutation, t, tErrors])

  const handleAction = useCallback(
    (action: string, params?: Record<string, unknown>) => {
      actionMutation.mutate(
        { action, ...(params ? { params } : {}) },
        {
          onSuccess: result => {
            if (result.success) {
              Toast.success(result.message)
            } else {
              Toast.error(result.message)
            }
          },
          onError: (error: unknown) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [actionMutation, tErrors]
  )

  return {
    router,
    t,
    isValidType,
    isLoading: isCreateMode ? false : connectorLoading,
    connector,
    type: validType,
    meta,
    Icon,
    isEditor,
    isAdmin,
    testing,
    deletePending: deleteMutation.isPending,
    createPending: createMutation.isPending,
    isCreateMode,

    // Workspace tab state
    activeTab,
    setActiveTab,

    // Workspace data
    overview,
    overviewFetching,
    recentActivity,
    activityFetching,
    entities,
    entitiesFetching,

    // Pagination
    activityPage,
    setActivityPage,
    entitiesPage,
    setEntitiesPage,

    // Search
    searchResults: searchMutation.data,
    searchPending: searchMutation.isPending,
    handleSearch,

    // Actions
    actionPending: actionMutation.isPending,
    handleAction,

    // Config actions
    handleTest,
    handleDelete,
    handleCreate,
    handleSync,
    syncPending: syncMutation.isPending,

    // Workspace enabled
    workspaceEnabled,
  }
}
