'use client'

import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import type { Alert, EscalateFormValues } from '@/types'
import { useCreateIncident } from './useIncidents'

export function useEscalateToIncidentDialog(
  alert: Alert | null,
  onOpenChange: (open: boolean) => void
) {
  const t = useTranslations('alerts')
  const tCommon = useTranslations('common')
  const createIncidentMutation = useCreateIncident()

  const handleSubmit = useCallback(
    (formData: EscalateFormValues) => {
      if (!alert) return

      createIncidentMutation.mutate(
        {
          title: formData.title,
          description: formData.description,
          severity: formData.severity,
          category: formData.category,
          linkedAlertIds: [alert.id],
          mitreTactics: alert.mitreTactics,
          mitreTechniques: alert.mitreTechniques,
        },
        {
          onSuccess: () => {
            Toast.success(t('escalateSuccess'))
            onOpenChange(false)
          },
          onError: () => {
            Toast.error(t('escalateError'))
          },
        }
      )
    },
    [alert, createIncidentMutation, t, onOpenChange]
  )

  return {
    t,
    tCommon,
    handleSubmit,
    isPending: createIncidentMutation.isPending,
  }
}
