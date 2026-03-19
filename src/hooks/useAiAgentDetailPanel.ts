import { useState, useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { AiAgentPanelTab, AiAgentStatus, Permission } from '@/enums'
import { isAiAgentPanelTab } from '@/lib/ai-agent.utils'
import { getErrorKey } from '@/lib/api-error'
import { AI_AGENT_STATUS_LABEL_KEYS, AI_AGENT_TIER_LABEL_KEYS } from '@/lib/constants/ai-agents'
import { hasPermission } from '@/lib/permissions'
import { lookup } from '@/lib/utils'
import { useAuthStore } from '@/stores'
import type { AiAgentDetailPanelProps } from '@/types'
import { useUpdateSoul, useStartAgent, useStopAgent, useRunAiAgent } from './useAiAgents'

export function useAiAgentDetailPanel({
  agent,
  onClose,
  onEdit,
  onDelete,
}: AiAgentDetailPanelProps) {
  const t = useTranslations('aiAgents')
  const tErrors = useTranslations('errors')
  const permissions = useAuthStore(s => s.permissions)

  const [activeTab, setActiveTab] = useState(AiAgentPanelTab.OVERVIEW)
  const [soulMdDraft, setSoulMdDraft] = useState(agent.soulMd ?? '')
  const [runPrompt, setRunPrompt] = useState('')
  const [toolDialogOpen, setToolDialogOpen] = useState(false)
  const [sessionsOpen, setSessionsOpen] = useState(true)
  const [toolsOpen, setToolsOpen] = useState(true)
  const [soulOpen, setSoulOpen] = useState(true)

  const updateSoulMutation = useUpdateSoul()
  const startAgentMutation = useStartAgent()
  const stopAgentMutation = useStopAgent()
  const runAgentMutation = useRunAiAgent()

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
    runAgentMutation.mutate(
      { id: agent.id, prompt: runPrompt },
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
  }, [agent.id, runAgentMutation, runPrompt, t, tErrors])

  const handleToggleAgent = isAgentOnline ? handleStopAgent : handleStartAgent
  const isToggling = startAgentMutation.isPending || stopAgentMutation.isPending
  const handleActiveTabChange = useCallback((value: string) => {
    if (isAiAgentPanelTab(value)) {
      setActiveTab(value)
    }
  }, [])

  return {
    t,
    activeTab,
    handleActiveTabChange,
    soulMdDraft,
    setSoulMdDraft,
    runPrompt,
    setRunPrompt,
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
    isAgentOnline,
    canExecute,
    isSavingSoul: updateSoulMutation.isPending,
    isToggling,
    isRunningAgent: runAgentMutation.isPending,
    onClose,
    onEdit,
    onDelete,
  }
}
