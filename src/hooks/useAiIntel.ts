'use client'

import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { Permission } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { hasPermission } from '@/lib/permissions'
import { intelService } from '@/services/intel.service'
import { useAuthStore } from '@/stores'
import type { AiIntelResult } from '@/types'
import { useAvailableAiConnectors } from './useAvailableAiConnectors'

export function useAiIntel() {
  const t = useTranslations('intel')
  const tCommon = useTranslations('common')
  const tErrors = useTranslations('errors')
  const permissions = useAuthStore(s => s.permissions)
  const canEnrich = hasPermission(permissions, Permission.INTEL_VIEW)

  const { availableConnectors, selectedConnector, setSelectedConnector, connectorValue } =
    useAvailableAiConnectors()

  const [activeTask, setActiveTask] = useState<string | null>(null)
  const [enrichResult, setEnrichResult] = useState<AiIntelResult | null>(null)
  const [advisoryResult, setAdvisoryResult] = useState<AiIntelResult | null>(null)

  const enrichMutation = useMutation({
    mutationFn: (iocId: string) => intelService.aiEnrichIoc(iocId, connectorValue),
    onSuccess: (data: AiIntelResult) => {
      setEnrichResult(data)
      setActiveTask(null)
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
      setActiveTask(null)
    },
  })

  const advisoryMutation = useMutation({
    mutationFn: (iocIds: string[]) => intelService.aiDraftAdvisory(iocIds, connectorValue),
    onSuccess: (data: AiIntelResult) => {
      setAdvisoryResult(data)
      setActiveTask(null)
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
      setActiveTask(null)
    },
  })

  const handleEnrichIoc = useCallback(
    (iocId: string) => {
      setActiveTask('enrich')
      enrichMutation.mutate(iocId)
    },
    [enrichMutation]
  )

  const handleDraftAdvisory = useCallback(
    (iocIds: string[]) => {
      setActiveTask('advisory')
      advisoryMutation.mutate(iocIds)
    },
    [advisoryMutation]
  )

  const isLoading = enrichMutation.isPending || advisoryMutation.isPending

  return {
    t,
    tCommon,
    tErrors,
    canEnrich,
    activeTask,
    enrichResult,
    advisoryResult,
    isLoading,
    handleEnrichIoc,
    handleDraftAdvisory,
    availableConnectors,
    selectedConnector,
    handleConnectorChange: setSelectedConnector,
  }
}
