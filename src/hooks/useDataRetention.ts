import { useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { RetentionPeriod } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { lookup } from '@/lib/utils'
import type { DataRetentionConfig } from '@/types'
import { usePreferences, useUpdatePreferences } from './useSettings'

const RETENTION_OPTIONS = [
  RetentionPeriod.DAYS_30,
  RetentionPeriod.DAYS_90,
  RetentionPeriod.DAYS_180,
  RetentionPeriod.DAYS_365,
  RetentionPeriod.UNLIMITED,
] as const

const DEFAULT_RETENTION: DataRetentionConfig = {
  alertRetention: RetentionPeriod.DAYS_90,
  logRetention: RetentionPeriod.DAYS_90,
  incidentRetention: RetentionPeriod.DAYS_365,
  auditLogRetention: RetentionPeriod.DAYS_365,
}

export function useDataRetention() {
  const t = useTranslations('settings')
  const tErrors = useTranslations()
  const { data: preferences } = usePreferences()
  const updatePreferences = useUpdatePreferences()

  const retentionConfig = useMemo(
    (): DataRetentionConfig => ({
      alertRetention:
        (preferences?.['retention_alerts'] as RetentionPeriod | undefined) ??
        DEFAULT_RETENTION.alertRetention,
      logRetention:
        (preferences?.['retention_logs'] as RetentionPeriod | undefined) ??
        DEFAULT_RETENTION.logRetention,
      incidentRetention:
        (preferences?.['retention_incidents'] as RetentionPeriod | undefined) ??
        DEFAULT_RETENTION.incidentRetention,
      auditLogRetention:
        (preferences?.['retention_auditLogs'] as RetentionPeriod | undefined) ??
        DEFAULT_RETENTION.auditLogRetention,
    }),
    [preferences]
  )

  const handleRetentionChange = useCallback(
    (key: keyof DataRetentionConfig, value: string) => {
      const prefKeyMap: Record<keyof DataRetentionConfig, string> = {
        alertRetention: 'retention_alerts',
        logRetention: 'retention_logs',
        incidentRetention: 'retention_incidents',
        auditLogRetention: 'retention_auditLogs',
      }
      updatePreferences.mutate(
        { [lookup(prefKeyMap, key)]: value },
        {
          onSuccess: () => {
            Toast.success(t('saved'))
          },
          onError: (error: unknown) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [updatePreferences, t, tErrors]
  )

  const getRetentionLabel = useCallback(
    (period: RetentionPeriod): string => {
      const labelMap: Record<RetentionPeriod, string> = {
        [RetentionPeriod.DAYS_30]: t('days30'),
        [RetentionPeriod.DAYS_90]: t('days90'),
        [RetentionPeriod.DAYS_180]: t('days180'),
        [RetentionPeriod.DAYS_365]: t('days365'),
        [RetentionPeriod.UNLIMITED]: t('unlimited'),
      }
      return lookup(labelMap, period)
    },
    [t]
  )

  return {
    t,
    retentionConfig,
    retentionOptions: RETENTION_OPTIONS,
    isPending: updatePreferences.isPending,
    handleRetentionChange,
    getRetentionLabel,
  }
}
