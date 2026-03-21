'use client'

import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { getErrorKey } from '@/lib/api-error'
import { reportService } from '@/services/report.service'
import type { AiResponse } from '@/types'

export function useAiReport() {
  const t = useTranslations('reports')
  const tErrors = useTranslations('errors')

  const [report, setReport] = useState<AiResponse | null>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d')

  const reportMutation = useMutation({
    mutationFn: (timeRange: string) => reportService.aiExecutiveReport(timeRange),
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
    report,
    selectedTimeRange,
    handleTimeRangeChange,
    generateReport,
    isLoading: reportMutation.isPending,
  }
}
