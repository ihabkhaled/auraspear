import { useState, useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { getErrorKey } from '@/lib/api-error'
import { AI_AGENT_STATUS_LABEL_KEYS, AI_AGENT_TIER_LABEL_KEYS } from '@/lib/constants/ai-agents'
import { lookup } from '@/lib/utils'
import type { AiAgentDetailPanelProps } from '@/types'
import { useUpdateSoul, useStopAgent } from './useAiAgents'

export function useAiAgentDetailPanel({
  agent,
  onClose,
  onEdit,
  onDelete,
}: AiAgentDetailPanelProps) {
  const t = useTranslations('aiAgents')
  const tErrors = useTranslations()

  const [activeTab, setActiveTab] = useState('overview')
  const [soulMdDraft, setSoulMdDraft] = useState(agent.soulMd ?? '')
  const [toolDialogOpen, setToolDialogOpen] = useState(false)

  const updateSoulMutation = useUpdateSoul()
  const stopAgentMutation = useStopAgent()

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

  return {
    t,
    activeTab,
    setActiveTab,
    soulMdDraft,
    setSoulMdDraft,
    toolDialogOpen,
    setToolDialogOpen,
    statusLabel,
    tierLabel,
    formattedTokens,
    formattedCost,
    formattedDate,
    handleSaveSoul,
    handleStopAgent,
    isSavingSoul: updateSoulMutation.isPending,
    isStopping: stopAgentMutation.isPending,
    onClose,
    onEdit,
    onDelete,
  }
}
