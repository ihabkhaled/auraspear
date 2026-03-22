'use client'

import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { Permission } from '@/enums'
import { hasPermission } from '@/lib/permissions'
import { detectionRuleService } from '@/services/detection-rule.service'
import { useAuthStore } from '@/stores'
import type { AiDetectionCopilotResult } from '@/types'
import { useAvailableAiConnectors } from './useAvailableAiConnectors'

export function useAiDetectionCopilot(ruleId: string | null) {
  const t = useTranslations('detectionRules')
  const tCommon = useTranslations('common')
  const tErrors = useTranslations('errors')
  const permissions = useAuthStore(s => s.permissions)
  const canUseCopilot = hasPermission(permissions, Permission.AI_DETECTION_COPILOT)

  const { availableConnectors, selectedConnector, setSelectedConnector, connectorValue } =
    useAvailableAiConnectors()

  const [activeTask, setActiveTask] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, AiDetectionCopilotResult>>({})
  const [draftDescription, setDraftDescription] = useState('')

  const draftRuleMutation = useMutation({
    mutationFn: () => detectionRuleService.aiDraftRule(draftDescription, connectorValue),
    onSuccess: (data: AiDetectionCopilotResult) => {
      setResults(prev => ({ ...prev, draftRule: data }))
      setActiveTask(null)
    },
    onError: () => {
      Toast.error(t('aiError'))
      setActiveTask(null)
    },
  })

  const tuningMutation = useMutation({
    mutationFn: () => {
      if (!ruleId) {
        return Promise.reject(new Error('No rule selected'))
      }
      return detectionRuleService.aiTuning(ruleId, connectorValue)
    },
    onSuccess: (data: AiDetectionCopilotResult) => {
      setResults(prev => ({ ...prev, tuning: data }))
      setActiveTask(null)
    },
    onError: () => {
      Toast.error(t('aiError'))
      setActiveTask(null)
    },
  })

  const handleDraftRule = useCallback(() => {
    if (!draftDescription.trim()) {
      return
    }
    setActiveTask('draftRule')
    draftRuleMutation.mutate()
  }, [draftRuleMutation, draftDescription])

  const handleTuning = useCallback(() => {
    if (!ruleId) {
      return
    }
    setActiveTask('tuning')
    tuningMutation.mutate()
  }, [tuningMutation, ruleId])

  const isLoading = draftRuleMutation.isPending || tuningMutation.isPending

  const resetResults = useCallback(() => {
    setResults({})
    setDraftDescription('')
    setActiveTask(null)
  }, [])

  return {
    t,
    tCommon,
    tErrors,
    canUseCopilot,
    activeTask,
    results,
    isLoading,
    draftDescription,
    setDraftDescription,
    handleDraftRule,
    handleTuning,
    resetResults,
    availableConnectors,
    selectedConnector,
    handleConnectorChange: setSelectedConnector,
  }
}
