'use client'

import { useCallback, useState } from 'react'
import { useTranslations } from 'next-intl'
import { SweetAlertDialog, SweetAlertIcon, Toast } from '@/components/common'
import { ApprovalStatus, Permission } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { hasPermission } from '@/lib/permissions'
import { useAuthStore } from '@/stores'
import type {
  CreateOsintSourceInput,
  OsintSourceConfig,
  ResolveApprovalInput,
  TenantAgentConfig,
  UpdateAgentConfigInput,
  UpdateOsintSourceInput,
} from '@/types'
import { useAgentConfigs, useToggleAgent, useUpdateAgentConfig } from './useAgentConfig'
import { useAiApprovals, useResolveApproval } from './useAiApprovals'
import { useAvailableAiConnectors } from './useAvailableAiConnectors'
import {
  useCreateOsintSource,
  useDeleteOsintSource,
  useOsintSources,
  useTestOsintSource,
  useUpdateOsintSource,
} from './useOsintSources'

export function useAiConfigPage() {
  const t = useTranslations('aiConfig')
  const tErrors = useTranslations('errors')
  const permissions = useAuthStore(s => s.permissions)

  // Permissions
  const canView = hasPermission(permissions, Permission.AI_CONFIG_VIEW)
  const canEdit = hasPermission(permissions, Permission.AI_CONFIG_EDIT)
  const canManageOsint = hasPermission(permissions, Permission.AI_CONFIG_MANAGE_OSINT)
  const canManageApprovals = hasPermission(permissions, Permission.AI_APPROVALS_MANAGE)

  // Tab state
  const [activeTab, setActiveTab] = useState('agents')

  // Dialog states — store agentId, not full config (avoids stale data after toggle/save)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [osintDialogOpen, setOsintDialogOpen] = useState(false)
  const [selectedOsintSource, setSelectedOsintSource] = useState<OsintSourceConfig | null>(null)
  const [approvalFilter, setApprovalFilter] = useState<string>(ApprovalStatus.PENDING)

  // Queries
  const { availableConnectors } = useAvailableAiConnectors()
  const agentConfigsQuery = useAgentConfigs()
  const osintSourcesQuery = useOsintSources()
  const approvalsQuery = useAiApprovals(approvalFilter === 'all' ? undefined : approvalFilter)

  // Mutations
  const updateConfigMutation = useUpdateAgentConfig()
  const toggleAgentMutation = useToggleAgent()
  const createOsintMutation = useCreateOsintSource()
  const updateOsintMutation = useUpdateOsintSource()
  const deleteOsintMutation = useDeleteOsintSource()
  const testOsintMutation = useTestOsintSource()
  const resolveApprovalMutation = useResolveApproval()

  // Derive selectedConfig from latest query data (always fresh after toggle/save)
  const agentConfigs: TenantAgentConfig[] = agentConfigsQuery.data?.data ?? []
  const selectedConfig = selectedAgentId
    ? agentConfigs.find(c => c.agentId === selectedAgentId) ?? null
    : null

  // Agent handlers
  const handleEditAgent = useCallback((config: TenantAgentConfig) => {
    setSelectedAgentId(config.agentId)
    setEditDialogOpen(true)
  }, [])

  const handleUpdateAgent = useCallback(
    (agentId: string, data: UpdateAgentConfigInput) => {
      updateConfigMutation.mutate(
        { agentId, data },
        {
          onSuccess: () => {
            Toast.success(t('configUpdated'))
            setEditDialogOpen(false)
            setSelectedAgentId(null)
          },
          onError: error => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [updateConfigMutation, t, tErrors]
  )

  const handleToggleAgent = useCallback(
    (agentId: string, enabled: boolean) => {
      toggleAgentMutation.mutate(
        { agentId, enabled },
        {
          onSuccess: () => {
            Toast.success(enabled ? t('agentEnabled') : t('agentDisabled'))
          },
          onError: error => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [toggleAgentMutation, t, tErrors]
  )

  // OSINT handlers
  const handleOpenOsintCreate = useCallback(() => {
    setSelectedOsintSource(null)
    setOsintDialogOpen(true)
  }, [])

  const handleEditOsint = useCallback((source: OsintSourceConfig) => {
    setSelectedOsintSource(source)
    setOsintDialogOpen(true)
  }, [])

  const handleOsintSubmit = useCallback(
    (data: CreateOsintSourceInput | UpdateOsintSourceInput) => {
      if (selectedOsintSource) {
        updateOsintMutation.mutate(
          { id: selectedOsintSource.id, data: data as UpdateOsintSourceInput },
          {
            onSuccess: () => {
              Toast.success(t('sourceUpdated'))
              setOsintDialogOpen(false)
              setSelectedOsintSource(null)
            },
            onError: error => {
              Toast.error(tErrors(getErrorKey(error)))
            },
          }
        )
      } else {
        createOsintMutation.mutate(data as CreateOsintSourceInput, {
          onSuccess: () => {
            Toast.success(t('sourceCreated'))
            setOsintDialogOpen(false)
          },
          onError: error => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        })
      }
    },
    [selectedOsintSource, updateOsintMutation, createOsintMutation, t, tErrors]
  )

  const handleDeleteOsint = useCallback(
    async (source: OsintSourceConfig) => {
      const confirmed = await SweetAlertDialog.show({
        text: t('deleteConfirm'),
        icon: SweetAlertIcon.QUESTION,
      })
      if (!confirmed) {
        return
      }
      deleteOsintMutation.mutate(source.id, {
        onSuccess: () => {
          Toast.success(t('sourceDeleted'))
        },
        onError: error => {
          Toast.error(tErrors(getErrorKey(error)))
        },
      })
    },
    [deleteOsintMutation, t, tErrors]
  )

  const handleTestOsint = useCallback(
    (sourceId: string) => {
      testOsintMutation.mutate(sourceId, {
        onSuccess: () => {
          Toast.success(t('testConnection'))
        },
        onError: error => {
          Toast.error(tErrors(getErrorKey(error)))
        },
      })
    },
    [testOsintMutation, t, tErrors]
  )

  // Approval handlers
  const handleResolveApproval = useCallback(
    (id: string, data: ResolveApprovalInput) => {
      resolveApprovalMutation.mutate(
        { id, data },
        {
          onSuccess: () => {
            Toast.success(t('approvalResolved'))
          },
          onError: error => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [resolveApprovalMutation, t, tErrors]
  )

  return {
    t,
    activeTab,
    setActiveTab,
    canView,
    canEdit,
    canManageOsint,
    canManageApprovals,
    // Agent configs
    agentConfigs,
    agentConfigsLoading: agentConfigsQuery.isFetching,
    editDialogOpen,
    setEditDialogOpen,
    selectedConfig,
    handleEditAgent,
    handleUpdateAgent,
    updateConfigLoading: updateConfigMutation.isPending,
    handleToggleAgent,
    availableConnectors,
    // OSINT sources
    osintSources: osintSourcesQuery.data?.data ?? [],
    osintSourcesLoading: osintSourcesQuery.isFetching,
    osintDialogOpen,
    setOsintDialogOpen,
    selectedOsintSource,
    handleOpenOsintCreate,
    handleEditOsint,
    handleOsintSubmit,
    osintSubmitLoading: createOsintMutation.isPending || updateOsintMutation.isPending,
    handleDeleteOsint,
    handleTestOsint,
    testOsintLoading: testOsintMutation.isPending,
    // Approvals
    approvals: approvalsQuery.data?.data ?? [],
    approvalsLoading: approvalsQuery.isFetching,
    approvalFilter,
    setApprovalFilter,
    handleResolveApproval,
    resolveApprovalLoading: resolveApprovalMutation.isPending,
  }
}
