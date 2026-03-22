'use client'

import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { Permission } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { hasPermission } from '@/lib/permissions'
import { alertService } from '@/services/alert.service'
import { useAuthStore } from '@/stores'
import type { AiTriageResult } from '@/types'
import { useAvailableAiConnectors } from './useAvailableAiConnectors'

export function useAiAlertTriage(alertId: string) {
  const t = useTranslations('alerts')
  const tCommon = useTranslations('common')
  const tErrors = useTranslations('errors')
  const permissions = useAuthStore(s => s.permissions)
  const canTriage = hasPermission(permissions, Permission.AI_ALERT_TRIAGE)

  const { availableConnectors, selectedConnector, setSelectedConnector, connectorValue } =
    useAvailableAiConnectors()

  const [activeTask, setActiveTask] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, AiTriageResult>>({})

  const summarizeMutation = useMutation({
    mutationFn: () => alertService.triageSummarize(alertId, connectorValue),
    onSuccess: (data: AiTriageResult) => {
      setResults(prev => ({ ...prev, summarize: data }))
      setActiveTask(null)
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
      setActiveTask(null)
    },
  })

  const explainSeverityMutation = useMutation({
    mutationFn: () => alertService.triageExplainSeverity(alertId, connectorValue),
    onSuccess: (data: AiTriageResult) => {
      setResults(prev => ({ ...prev, explainSeverity: data }))
      setActiveTask(null)
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
      setActiveTask(null)
    },
  })

  const falsePositiveScoreMutation = useMutation({
    mutationFn: () => alertService.triageFalsePositiveScore(alertId, connectorValue),
    onSuccess: (data: AiTriageResult) => {
      setResults(prev => ({ ...prev, falsePositiveScore: data }))
      setActiveTask(null)
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
      setActiveTask(null)
    },
  })

  const nextActionMutation = useMutation({
    mutationFn: () => alertService.triageNextAction(alertId, connectorValue),
    onSuccess: (data: AiTriageResult) => {
      setResults(prev => ({ ...prev, nextAction: data }))
      setActiveTask(null)
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
      setActiveTask(null)
    },
  })

  const handleSummarize = useCallback(() => {
    setActiveTask('summarize')
    summarizeMutation.mutate()
  }, [summarizeMutation])

  const handleExplainSeverity = useCallback(() => {
    setActiveTask('explainSeverity')
    explainSeverityMutation.mutate()
  }, [explainSeverityMutation])

  const handleFalsePositiveScore = useCallback(() => {
    setActiveTask('falsePositiveScore')
    falsePositiveScoreMutation.mutate()
  }, [falsePositiveScoreMutation])

  const handleNextAction = useCallback(() => {
    setActiveTask('nextAction')
    nextActionMutation.mutate()
  }, [nextActionMutation])

  const isLoading =
    summarizeMutation.isPending ||
    explainSeverityMutation.isPending ||
    falsePositiveScoreMutation.isPending ||
    nextActionMutation.isPending

  return {
    t,
    tCommon,
    tErrors,
    canTriage,
    activeTask,
    results,
    isLoading,
    handleSummarize,
    handleExplainSeverity,
    handleFalsePositiveScore,
    handleNextAction,
    availableConnectors,
    selectedConnector,
    handleConnectorChange: setSelectedConnector,
  }
}
