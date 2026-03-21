'use client'

import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { getErrorKey } from '@/lib/api-error'
import { dashboardService } from '@/services/dashboard.service'
import type { AiNotificationDigestResult } from '@/types'

export function useAiNotificationDigest() {
  const t = useTranslations('notifications')
  const tErrors = useTranslations('errors')

  const [digestResult, setDigestResult] = useState<AiNotificationDigestResult | null>(null)

  const digestMutation = useMutation({
    mutationFn: () => dashboardService.aiDailySummary(),
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
    tErrors,
    digestResult,
    isLoading: digestMutation.isPending,
    handleGenerateDigest,
  }
}
