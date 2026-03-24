'use client'

import { useCallback, useState } from 'react'
import { useTranslations } from 'next-intl'
import { SweetAlertDialog, SweetAlertIcon, Toast } from '@/components/common'
import { ApprovalStatus, Permission } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { hasPermission } from '@/lib/permissions'
import { useAuthStore } from '@/stores'
import type {
  AiFeatureConfig,
  AiPromptTemplate,
  CreateAiPromptInput,
  CreateOsintSourceInput,
  OsintSourceConfig,
  ResolveApprovalInput,
  TenantAgentConfig,
  UpdateAgentConfigInput,
  UpdateAiFeatureConfigInput,
  UpdateAiPromptInput,
  UpdateOsintSourceInput,
} from '@/types'
import { useAgentConfigs, useToggleAgent, useUpdateAgentConfig } from './useAgentConfig'
import { useAiApprovals, useResolveApproval } from './useAiApprovals'
import { useAiFeatures, useUpdateAiFeature } from './useAiFeatures'
import {
  useAiPrompts,
  useActivateAiPrompt,
  useCreateAiPrompt,
  useDeleteAiPrompt,
  useUpdateAiPrompt,
} from './useAiPrompts'
import { useAvailableAiConnectors } from './useAvailableAiConnectors'
import { useOrchestratorStats } from './useOrchestratorStats'
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
  const canManagePrompts = hasPermission(permissions, Permission.AI_CONFIG_MANAGE_PROMPTS)

  // Tab state
  const [activeTab, setActiveTab] = useState('agents')

  // Dialog states — store agentId, not full config (avoids stale data after toggle/save)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [osintDialogOpen, setOsintDialogOpen] = useState(false)
  const [selectedOsintSource, setSelectedOsintSource] = useState<OsintSourceConfig | null>(null)
  const [approvalFilter, setApprovalFilter] = useState<string>(ApprovalStatus.PENDING)

  // Prompt dialog state
  const [promptDialogOpen, setPromptDialogOpen] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<AiPromptTemplate | null>(null)

  // Feature dialog state
  const [featureDialogOpen, setFeatureDialogOpen] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<AiFeatureConfig | null>(null)

  // Orchestrator stats
  const { stats: orchestratorStats, isFetching: orchestratorStatsFetching } = useOrchestratorStats()

  // Queries
  const { availableConnectors } = useAvailableAiConnectors()
  const agentConfigsQuery = useAgentConfigs()
  const osintSourcesQuery = useOsintSources()
  const approvalsQuery = useAiApprovals(approvalFilter === 'all' ? undefined : approvalFilter)
  const promptsQuery = useAiPrompts()
  const featuresQuery = useAiFeatures()

  // Mutations
  const updateConfigMutation = useUpdateAgentConfig()
  const toggleAgentMutation = useToggleAgent()
  const createOsintMutation = useCreateOsintSource()
  const updateOsintMutation = useUpdateOsintSource()
  const deleteOsintMutation = useDeleteOsintSource()
  const testOsintMutation = useTestOsintSource()
  const resolveApprovalMutation = useResolveApproval()
  const createPromptMutation = useCreateAiPrompt()
  const updatePromptMutation = useUpdateAiPrompt()
  const activatePromptMutation = useActivateAiPrompt()
  const deletePromptMutation = useDeleteAiPrompt()
  const updateFeatureMutation = useUpdateAiFeature()

  // Derive selectedConfig from latest query data (always fresh after toggle/save)
  const agentConfigs: TenantAgentConfig[] = agentConfigsQuery.data?.data ?? []
  const selectedConfig = selectedAgentId
    ? (agentConfigs.find(c => c.agentId === selectedAgentId) ?? null)
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
        onSuccess: result => {
          const testData = result?.data as
            | { success?: boolean; messageKey?: string; error?: string }
            | undefined
          if (testData?.success) {
            Toast.success(t('testConnectionSuccess'))
          } else {
            const msgKey = testData?.messageKey?.replace('errors.', '') ?? ''
            const translated = msgKey ? tErrors(msgKey) : testData?.error
            Toast.error(translated ?? t('testConnectionFailed'))
          }
        },
        onError: (error: unknown) => {
          Toast.error(tErrors(getErrorKey(error)))
        },
      })
    },
    [testOsintMutation, t, tErrors]
  )

  const handleToggleOsint = useCallback(
    (sourceId: string, enabled: boolean) => {
      updateOsintMutation.mutate(
        { id: sourceId, data: { isEnabled: enabled } },
        {
          onSuccess: () => {
            Toast.success(enabled ? t('sourceEnabled') : t('sourceDisabled'))
          },
          onError: (error: unknown) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [updateOsintMutation, t, tErrors]
  )

  // Prompt handlers
  const handleOpenPromptCreate = useCallback(() => {
    setSelectedPrompt(null)
    setPromptDialogOpen(true)
  }, [])

  const handleEditPrompt = useCallback((prompt: AiPromptTemplate) => {
    setSelectedPrompt(prompt)
    setPromptDialogOpen(true)
  }, [])

  const handlePromptSubmit = useCallback(
    (data: CreateAiPromptInput | UpdateAiPromptInput) => {
      if (selectedPrompt) {
        updatePromptMutation.mutate(
          { id: selectedPrompt.id, data: data as UpdateAiPromptInput },
          {
            onSuccess: () => {
              Toast.success(t('promptUpdated'))
              setPromptDialogOpen(false)
              setSelectedPrompt(null)
            },
            onError: (error: unknown) => {
              Toast.error(tErrors(getErrorKey(error)))
            },
          }
        )
      } else {
        createPromptMutation.mutate(data as CreateAiPromptInput, {
          onSuccess: () => {
            Toast.success(t('promptCreated'))
            setPromptDialogOpen(false)
          },
          onError: (error: unknown) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        })
      }
    },
    [selectedPrompt, updatePromptMutation, createPromptMutation, t, tErrors]
  )

  const handleActivatePrompt = useCallback(
    (id: string) => {
      activatePromptMutation.mutate(id, {
        onSuccess: () => {
          Toast.success(t('promptActivated'))
        },
        onError: (error: unknown) => {
          Toast.error(tErrors(getErrorKey(error)))
        },
      })
    },
    [activatePromptMutation, t, tErrors]
  )

  const handleDeletePrompt = useCallback(
    async (prompt: AiPromptTemplate) => {
      const confirmed = await SweetAlertDialog.show({
        text: t('deletePromptConfirm'),
        icon: SweetAlertIcon.QUESTION,
      })
      if (!confirmed) {
        return
      }
      deletePromptMutation.mutate(prompt.id, {
        onSuccess: () => {
          Toast.success(t('promptDeleted'))
        },
        onError: (error: unknown) => {
          Toast.error(tErrors(getErrorKey(error)))
        },
      })
    },
    [deletePromptMutation, t, tErrors]
  )

  // Feature handlers
  const handleEditFeature = useCallback((feature: AiFeatureConfig) => {
    setSelectedFeature(feature)
    setFeatureDialogOpen(true)
  }, [])

  const handleUpdateFeature = useCallback(
    (featureKey: string, data: UpdateAiFeatureConfigInput) => {
      updateFeatureMutation.mutate(
        { featureKey, data },
        {
          onSuccess: () => {
            Toast.success(t('featureUpdated'))
            setFeatureDialogOpen(false)
            setSelectedFeature(null)
          },
          onError: (error: unknown) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [updateFeatureMutation, t, tErrors]
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
    // Orchestrator stats
    orchestratorStats,
    orchestratorStatsFetching,
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
    handleToggleOsint,
    testOsintLoading: testOsintMutation.isPending,
    // Approvals
    approvals: approvalsQuery.data?.data ?? [],
    approvalsLoading: approvalsQuery.isFetching,
    approvalFilter,
    setApprovalFilter,
    handleResolveApproval,
    resolveApprovalLoading: resolveApprovalMutation.isPending,
    // Prompts
    prompts: (promptsQuery.data?.data ?? []) as AiPromptTemplate[],
    promptsLoading: promptsQuery.isFetching,
    promptDialogOpen,
    setPromptDialogOpen,
    selectedPrompt,
    handleOpenPromptCreate,
    handleEditPrompt,
    handlePromptSubmit,
    promptSubmitLoading: createPromptMutation.isPending || updatePromptMutation.isPending,
    handleActivatePrompt,
    handleDeletePrompt,
    canManagePrompts,
    // Features
    features: (featuresQuery.data?.data ?? []) as AiFeatureConfig[],
    featuresLoading: featuresQuery.isFetching,
    featureDialogOpen,
    setFeatureDialogOpen,
    selectedFeature,
    handleEditFeature,
    handleUpdateFeature,
    featureUpdateLoading: updateFeatureMutation.isPending,
  }
}
