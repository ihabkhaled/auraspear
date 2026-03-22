'use client'

import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { Permission } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { hasPermission } from '@/lib/permissions'
import { soarService } from '@/services/soar.service'
import { useAuthStore } from '@/stores'
import type { AiSoarResult } from '@/types'
import { useAvailableAiConnectors } from './useAvailableAiConnectors'

export function useAiSoar() {
  const t = useTranslations('soar')
  const tCommon = useTranslations('common')
  const tErrors = useTranslations('errors')
  const permissions = useAuthStore(s => s.permissions)
  const canUseCopilot = hasPermission(permissions, Permission.AI_SOAR_COPILOT)

  const { availableConnectors, selectedConnector, setSelectedConnector, connectorValue } =
    useAvailableAiConnectors()

  const [description, setDescription] = useState('')
  const [draftResult, setDraftResult] = useState<AiSoarResult | null>(null)

  const draftMutation = useMutation({
    mutationFn: (desc: string) => soarService.aiDraftPlaybook(desc, connectorValue),
    onSuccess: (data: AiSoarResult) => {
      setDraftResult(data)
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
    },
  })

  const handleDraftPlaybook = useCallback(() => {
    if (description.trim().length === 0) {
      return
    }
    draftMutation.mutate(description)
  }, [description, draftMutation])

  return {
    t,
    tCommon,
    tErrors,
    canUseCopilot,
    description,
    setDescription,
    draftResult,
    isLoading: draftMutation.isPending,
    handleDraftPlaybook,
    availableConnectors,
    selectedConnector,
    handleConnectorChange: setSelectedConnector,
  }
}
