'use client'

import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { getErrorKey } from '@/lib/api-error'
import { dashboardService } from '@/services/dashboard.service'
import type { AiNotificationDigestResult } from '@/types'
import { useAvailableAiConnectors } from './useAvailableAiConnectors'

export function useAiNotificationDigest() {
  const t = useTranslations('notifications')
  const tCommon = useTranslations('common')
  const tErrors = useTranslations('errors')

  const { availableConnectors, selectedConnector, setSelectedConnector, connectorValue } =
    useAvailableAiConnectors()

  const [digestResult, setDigestResult] = useState<AiNotificationDigestResult | null>(null)

  const digestMutation = useMutation({
    mutationFn: () => dashboardService.aiDailySummary(connectorValue),
    onSuccess: (data: AiNotificationDigestResult) => {
      setDigestResult(data)
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
    },
  })

  const handleGenerateDigest = useCallback(() => {
    digestMutation.mutate()
  }, [digestMutation])

  return {
    t,
    tCommon,
    tErrors,
    digestResult,
    isLoading: digestMutation.isPending,
    handleGenerateDigest,
    availableConnectors,
    selectedConnector,
    handleConnectorChange: setSelectedConnector,
  }
}
