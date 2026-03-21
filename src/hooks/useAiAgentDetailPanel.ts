import { useState, useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { AiAgentPanelTab, AiAgentStatus, AiConnectorType, Permission } from '@/enums'
import { isAiAgentPanelTab } from '@/lib/ai-agent.utils'
import { getErrorKey } from '@/lib/api-error'
import { AI_AGENT_STATUS_LABEL_KEYS, AI_AGENT_TIER_LABEL_KEYS } from '@/lib/constants/ai-agents'
import { hasPermission } from '@/lib/permissions'
import { lookup } from '@/lib/utils'
import { llmConnectorService } from '@/services/llm-connector.service'
import { useAuthStore } from '@/stores'
import type { AiAgentDetailPanelProps, AiAgentToolFormValues, AvailableAiConnector } from '@/types'
import {
  useAiAgent,
  useUpdateSoul,
  useStartAgent,
  useStopAgent,
  useRunAiAgent,
  useCreateAgentTool,
  useDeleteAgentTool,
} from './useAiAgents'

export function useAiAgentDetailPanel({
  agent: listAgent,
  onClose,
  onEdit,
  onDelete,
}: AiAgentDetailPanelProps) {
  const t = useTranslations('aiAgents')
  const tErrors = useTranslations('errors')
  const permissions = useAuthStore(s => s.permissions)

  // Fetch full agent with tools and sessions from the detail endpoint
  const { data: fullAgentResponse } = useAiAgent(listAgent.id)
  const agent = fullAgentResponse?.data ?? listAgent

  const defaultConnectorOption: AvailableAiConnector = useMemo(
    () => ({
      key: 'default',
      label: t('connectorDefault'),
      type: AiConnectorType.SYSTEM,
      enabled: true,
    }),
    [t]
  )

  const { data: fetchedConnectors } = useQuery({
    queryKey: ['ai-connectors-available'],
    queryFn: () => llmConnectorService.getAvailable(),
  })

  const availableConnectors = useMemo(
    () => fetchedConnectors ?? [defaultConnectorOption],
    [fetchedConnectors, defaultConnectorOption]
  )

  const [activeTab, setActiveTab] = useState(AiAgentPanelTab.OVERVIEW)
  const [soulMdDraft, setSoulMdDraft] = useState(agent.soulMd ?? '')
  const [runPrompt, setRunPrompt] = useState('')
  const [selectedConnector, setSelectedConnector] = useState('default')
  const [toolDialogOpen, setToolDialogOpen] = useState(false)
  const [sessionsOpen, setSessionsOpen] = useState(true)
  const [toolsOpen, setToolsOpen] = useState(true)
  const [soulOpen, setSoulOpen] = useState(true)

  const updateSoulMutation = useUpdateSoul()
  const startAgentMutation = useStartAgent()
  const stopAgentMutation = useStopAgent()
  const runAgentMutation = useRunAiAgent()
  const createToolMutation = useCreateAgentTool()
  const deleteToolMutation = useDeleteAgentTool()

  const isAgentOnline = agent.status === AiAgentStatus.ONLINE
  const canExecute = hasPermission(permissions, Permission.AI_AGENTS_EXECUTE)

  const statusLabel = useMemo(
    () => t(lookup(AI_AGENT_STATUS_LABEL_KEYS, agent.status)),
    [agent.status, t]
  )

  const tierLabel = useMemo(() => t(lookup(AI_AGENT_TIER_LABEL_KEYS, agent.tier)), [agent.tier, t])

  const formattedTokens = useMemo(() => agent.totalTokens.toLocaleString(), [agent.totalTokens])

  const formattedCost = useMemo(() => `$${agent.totalCost.toFixed(2)}`, [agent.totalCost])

  const formattedDate = useMemo(
    () => new Date(agent.createdAt).toLocaleDateString(),
    [agent.createdAt]
  )

  const handleSaveSoul = useCallback(() => {
    updateSoulMutation.mutate(
      { id: agent.id, soulMd: soulMdDraft },
      {
        onSuccess: () => {
          Toast.success(t('soulUpdated'))
        },
        onError: (error: unknown) => {
          Toast.error(tErrors(getErrorKey(error)))
        },
      }
    )
  }, [agent.id, soulMdDraft, updateSoulMutation, t, tErrors])

  const handleStartAgent = useCallback(() => {
    startAgentMutation.mutate(agent.id, {
      onSuccess: () => {
        Toast.success(t('agentStarted'))
      },
      onError: (error: unknown) => {
        Toast.error(tErrors(getErrorKey(error)))
      },
    })
  }, [agent.id, startAgentMutation, t, tErrors])

  const handleStopAgent = useCallback(() => {
    stopAgentMutation.mutate(agent.id, {
      onSuccess: () => {
        Toast.success(t('agentStopped'))
      },
      onError: (error: unknown) => {
        Toast.error(tErrors(getErrorKey(error)))
      },
    })
  }, [agent.id, stopAgentMutation, t, tErrors])

  const handleRunAgent = useCallback(() => {
    const connectorValue = selectedConnector === 'default' ? undefined : selectedConnector
    runAgentMutation.mutate(
      { id: agent.id, prompt: runPrompt, connector: connectorValue },
      {
        onSuccess: () => {
          setRunPrompt('')
          Toast.success(t('runQueued'))
        },
        onError: (error: unknown) => {
          Toast.error(tErrors(getErrorKey(error)))
        },
      }
    )
  }, [agent.id, runAgentMutation, runPrompt, selectedConnector, t, tErrors])

  const handleCreateTool = useCallback(
    (formValues: AiAgentToolFormValues) => {
      let parsedSchema: Record<string, unknown> = {}
      try {
        parsedSchema = JSON.parse(formValues.schema) as Record<string, unknown>
      } catch {
        Toast.error(tErrors('aiAgents.invalidToolSchema'))
        return
      }
      createToolMutation.mutate(
        {
          agentId: agent.id,
          data: {
            name: formValues.name,
            description: formValues.description,
            schema: parsedSchema,
          },
        },
        {
          onSuccess: () => {
            setToolDialogOpen(false)
            Toast.success(t('toolCreated'))
          },
          onError: (error: unknown) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [agent.id, createToolMutation, t, tErrors]
  )

  const handleDeleteTool = useCallback(
    (toolId: string) => {
      deleteToolMutation.mutate(
        { agentId: agent.id, toolId },
        {
          onSuccess: () => {
            Toast.success(t('toolDeleted'))
          },
          onError: (error: unknown) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [agent.id, deleteToolMutation, t, tErrors]
  )

  const handleToggleAgent = isAgentOnline ? handleStopAgent : handleStartAgent
  const isToggling = startAgentMutation.isPending || stopAgentMutation.isPending
  const handleActiveTabChange = useCallback((value: string) => {
    if (isAiAgentPanelTab(value)) {
      setActiveTab(value)
    }
  }, [])

  const handleConnectorChange = useCallback((value: string) => {
    setSelectedConnector(value)
  }, [])

  return {
    t,
    agent,
    activeTab,
    handleActiveTabChange,
    availableConnectors,
    soulMdDraft,
    setSoulMdDraft,
    runPrompt,
    setRunPrompt,
    selectedConnector,
    handleConnectorChange,
    toolDialogOpen,
    setToolDialogOpen,
    sessionsOpen,
    setSessionsOpen,
    toolsOpen,
    setToolsOpen,
    soulOpen,
    setSoulOpen,
    statusLabel,
    tierLabel,
    formattedTokens,
    formattedCost,
    formattedDate,
    handleSaveSoul,
    handleToggleAgent,
    handleRunAgent,
    handleCreateTool,
    handleDeleteTool,
    isAgentOnline,
    canExecute,
    isSavingSoul: updateSoulMutation.isPending,
    isToggling,
    isRunningAgent: runAgentMutation.isPending,
    isCreatingTool: createToolMutation.isPending,
    isDeletingTool: deleteToolMutation.isPending,
    onClose,
    onEdit,
    onDelete,
  }
}
