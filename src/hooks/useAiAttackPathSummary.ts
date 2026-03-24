'use client'

import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { Permission } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { hasPermission } from '@/lib/permissions'
import { attackPathService } from '@/services/attack-path.service'
import { useAuthStore } from '@/stores'
import type { AiAttackPathSummaryResult } from '@/types'
import { useAvailableAiConnectors } from './useAvailableAiConnectors'

export function useAiAttackPathSummary(pathId: string) {
  const t = useTranslations('attackPath')
  const tCommon = useTranslations('common')
  const tErrors = useTranslations('errors')
  const permissions = useAuthStore(s => s.permissions)
  const canSummarize = hasPermission(permissions, Permission.AI_ATTACK_PATH_SUMMARY)

  const { availableConnectors, selectedConnector, setSelectedConnector, connectorValue } =
    useAvailableAiConnectors()

  const [result, setResult] = useState<AiAttackPathSummaryResult | null>(null)

  const summarizeMutation = useMutation({
    mutationFn: () => attackPathService.aiSummarize(pathId, connectorValue),
    onSuccess: (data: AiAttackPathSummaryResult) => {
      setResult(data)
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
    },
  })

  const handleSummarize = useCallback(() => {
    summarizeMutation.mutate()
  }, [summarizeMutation])

  const handleClearResult = useCallback(() => {
    setResult(null)
  }, [])

  return {
    t,
    tCommon,
    tErrors,
    canSummarize,
    summarize: handleSummarize,
    isSummarizing: summarizeMutation.isPending,
    result,
    clearResult: handleClearResult,
    availableConnectors,
    selectedConnector,
    handleConnectorChange: setSelectedConnector,
  }
}
