'use client'

import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { IncidentSeverity } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { lookup } from '@/lib/utils'
import type { Alert, EscalateFormValues } from '@/types'
import { useCreateIncident } from './useIncidents'

const SEVERITY_MAP: Record<string, IncidentSeverity> = {
  critical: IncidentSeverity.CRITICAL,
  high: IncidentSeverity.HIGH,
  medium: IncidentSeverity.MEDIUM,
  low: IncidentSeverity.LOW,
  info: IncidentSeverity.LOW,
}

function mapSeverity(alertSeverity: string): IncidentSeverity {
  return lookup(SEVERITY_MAP, alertSeverity) ?? IncidentSeverity.MEDIUM
}

export function useEscalateToIncidentDialog(
  alert: Alert | null,
  onOpenChange: (open: boolean) => void
) {
  const t = useTranslations('alerts')
  const tCommon = useTranslations('common')
  const tError = useTranslations('errors')
  const createIncidentMutation = useCreateIncident()

  const defaultSeverity = alert ? mapSeverity(alert.severity) : IncidentSeverity.MEDIUM

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
          onError: (error: unknown) => {
            Toast.error(tError(getErrorKey(error)))
          },
        }
      )
    },
    [alert, createIncidentMutation, t, tError, onOpenChange]
  )

  return {
    t,
    tCommon,
    handleSubmit,
    isPending: createIncidentMutation.isPending,
    defaultSeverity,
  }
}
