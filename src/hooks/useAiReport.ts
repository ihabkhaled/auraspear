'use client'

import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { getErrorKey } from '@/lib/api-error'
import { reportService } from '@/services/report.service'
import type { AiResponse } from '@/types'
import { useAvailableAiConnectors } from './useAvailableAiConnectors'

export function useAiReport() {
  const t = useTranslations('reports')
  const tCommon = useTranslations('common')
  const tErrors = useTranslations('errors')

  const { availableConnectors, selectedConnector, setSelectedConnector, connectorValue } =
    useAvailableAiConnectors()

  const [report, setReport] = useState<AiResponse | null>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d')

  const reportMutation = useMutation({
    mutationFn: (timeRange: string) => reportService.aiExecutiveReport(timeRange, connectorValue),
    onSuccess: (data: AiResponse) => {
      setReport(data)
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
    },
  })

  const generateReport = useCallback(() => {
    reportMutation.mutate(selectedTimeRange)
  }, [reportMutation, selectedTimeRange])

  const handleTimeRangeChange = useCallback((timeRange: string) => {
    setSelectedTimeRange(timeRange)
  }, [])

  return {
    t,
    tCommon,
    report,
    selectedTimeRange,
    handleTimeRangeChange,
    generateReport,
    isLoading: reportMutation.isPending,
    availableConnectors,
    selectedConnector,
    handleConnectorChange: setSelectedConnector,
  }
}
