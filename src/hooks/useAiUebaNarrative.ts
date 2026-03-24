'use client'

import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { Permission } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { hasPermission } from '@/lib/permissions'
import { uebaService } from '@/services/ueba.service'
import { useAuthStore } from '@/stores'
import type { AiUebaNarrativeResult } from '@/types'
import { useAvailableAiConnectors } from './useAvailableAiConnectors'

export function useAiUebaNarrative(anomalyId: string) {
  const t = useTranslations('ueba')
  const tCommon = useTranslations('common')
  const tErrors = useTranslations('errors')
  const permissions = useAuthStore(s => s.permissions)
  const canExplain = hasPermission(permissions, Permission.AI_UEBA_NARRATIVE)

  const { availableConnectors, selectedConnector, setSelectedConnector, connectorValue } =
    useAvailableAiConnectors()

  const [result, setResult] = useState<AiUebaNarrativeResult | null>(null)

  const explainMutation = useMutation({
    mutationFn: () => uebaService.aiExplainAnomaly(anomalyId, connectorValue),
    onSuccess: (data: AiUebaNarrativeResult) => {
      setResult(data)
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
    },
  })

  const handleExplain = useCallback(() => {
    explainMutation.mutate()
  }, [explainMutation])

  const handleClearResult = useCallback(() => {
    setResult(null)
  }, [])

  return {
    t,
    tCommon,
    tErrors,
    canExplain,
    explain: handleExplain,
    isExplaining: explainMutation.isPending,
    result,
    clearResult: handleClearResult,
    availableConnectors,
    selectedConnector,
    handleConnectorChange: setSelectedConnector,
  }
}
