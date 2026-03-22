'use client'

import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { Permission } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { hasPermission } from '@/lib/permissions'
import { normalizationService } from '@/services/normalization.service'
import { useAuthStore } from '@/stores'
import type { AiResponse } from '@/types'
import { useAvailableAiConnectors } from './useAvailableAiConnectors'

export function useAiNormVerifier() {
  const t = useTranslations('normalization')
  const tErrors = useTranslations('errors')
  const permissions = useAuthStore(s => s.permissions)
  const canVerify = hasPermission(permissions, Permission.NORMALIZATION_VIEW)

  const { availableConnectors, selectedConnector, setSelectedConnector, connectorValue } =
    useAvailableAiConnectors()

  const [result, setResult] = useState<AiResponse | null>(null)

  const verifyMutation = useMutation({
    mutationFn: (params: { pipelineId: string; sampleEvents: unknown[] }) =>
      normalizationService.aiVerifyPipeline(params.pipelineId, params.sampleEvents, connectorValue),
    onSuccess: (data: AiResponse) => {
      setResult(data)
      Toast.success(t('aiVerifySuccess'))
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
    },
  })

  const handleVerify = useCallback(
    (pipelineId: string, sampleEvents: unknown[]) => {
      verifyMutation.mutate({ pipelineId, sampleEvents })
    },
    [verifyMutation]
  )

  const resetResult = useCallback(() => {
    setResult(null)
  }, [])

  return {
    t,
    tErrors,
    canVerify,
    availableConnectors,
    selectedConnector,
    setSelectedConnector,
    verifyMutation,
    result,
    isVerifying: verifyMutation.isPending,
    handleVerify,
    resetResult,
  }
}
