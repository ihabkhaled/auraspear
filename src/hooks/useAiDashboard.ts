'use client'

import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { getErrorKey } from '@/lib/api-error'
import { dashboardService } from '@/services/dashboard.service'
import type { AiResponse, ExplainAnomalyInput } from '@/types'
import { useAvailableAiConnectors } from './useAvailableAiConnectors'

export function useAiDashboard() {
  const t = useTranslations('dashboard')
  const tCommon = useTranslations('common')
  const tErrors = useTranslations('errors')

  const { availableConnectors, selectedConnector, setSelectedConnector, connectorValue } =
    useAvailableAiConnectors()

  const [dailySummary, setDailySummary] = useState<AiResponse | null>(null)
  const [anomalyExplanation, setAnomalyExplanation] = useState<AiResponse | null>(null)

  const dailySummaryMutation = useMutation({
    mutationFn: () => dashboardService.aiDailySummary(connectorValue),
    onSuccess: (data: AiResponse) => {
      setDailySummary(data)
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
    },
  })

  const explainAnomalyMutation = useMutation({
    mutationFn: (input: ExplainAnomalyInput) =>
      dashboardService.aiExplainAnomaly(input, connectorValue),
    onSuccess: (data: AiResponse) => {
      setAnomalyExplanation(data)
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
    },
  })

  const generateDailySummary = useCallback(() => {
    dailySummaryMutation.mutate()
  }, [dailySummaryMutation])

  const explainAnomaly = useCallback(
    (input: ExplainAnomalyInput) => {
      explainAnomalyMutation.mutate(input)
    },
    [explainAnomalyMutation]
  )

  return {
    t,
    tCommon,
    dailySummary,
    anomalyExplanation,
    generateDailySummary,
    explainAnomaly,
    isDailySummaryLoading: dailySummaryMutation.isPending,
    isExplainAnomalyLoading: explainAnomalyMutation.isPending,
    availableConnectors,
    selectedConnector,
    handleConnectorChange: setSelectedConnector,
  }
}
