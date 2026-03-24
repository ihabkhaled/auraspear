'use client'

import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { Permission } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { hasPermission } from '@/lib/permissions'
import { cloudSecurityService } from '@/services/cloud-security.service'
import { useAuthStore } from '@/stores'
import type { AiCloudTriageResult } from '@/types'
import { useAvailableAiConnectors } from './useAvailableAiConnectors'

export function useAiCloudTriage(findingId: string) {
  const t = useTranslations('cloudSecurity')
  const tCommon = useTranslations('common')
  const tErrors = useTranslations('errors')
  const permissions = useAuthStore(s => s.permissions)
  const canTriage = hasPermission(permissions, Permission.AI_CLOUD_TRIAGE)

  const { availableConnectors, selectedConnector, setSelectedConnector, connectorValue } =
    useAvailableAiConnectors()

  const [result, setResult] = useState<AiCloudTriageResult | null>(null)

  const triageMutation = useMutation({
    mutationFn: () => cloudSecurityService.aiTriageFinding(findingId, connectorValue),
    onSuccess: (data: AiCloudTriageResult) => {
      setResult(data)
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
    },
  })

  const handleTriage = useCallback(() => {
    triageMutation.mutate()
  }, [triageMutation])

  const handleClearResult = useCallback(() => {
    setResult(null)
  }, [])

  return {
    t,
    tCommon,
    tErrors,
    canTriage,
    triage: handleTriage,
    isTriaging: triageMutation.isPending,
    result,
    clearResult: handleClearResult,
    availableConnectors,
    selectedConnector,
    handleConnectorChange: setSelectedConnector,
  }
}
