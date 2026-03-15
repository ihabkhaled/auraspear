import { useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { NotificationCategory } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { usePreferences, useUpdatePreferences } from './useSettings'

const NOTIFICATION_CATEGORIES = [
  NotificationCategory.CRITICAL_ALERTS,
  NotificationCategory.HIGH_ALERTS,
  NotificationCategory.CASE_ASSIGNMENTS,
  NotificationCategory.INCIDENT_UPDATES,
  NotificationCategory.COMPLIANCE_ALERTS,
] as const

export function useNotificationPreferences() {
  const t = useTranslations('settings')
  const tErrors = useTranslations()
  const { data: preferences } = usePreferences()
  const updatePreferences = useUpdatePreferences()

  const categoryStates = useMemo(
    () =>
      NOTIFICATION_CATEGORIES.map(category => ({
        category,
        enabled: Boolean(preferences?.[`notification_${category}`] ?? true),
      })),
    [preferences]
  )

  const handleToggle = useCallback(
    (category: NotificationCategory, checked: boolean) => {
      updatePreferences.mutate(
        { [`notification_${category}`]: checked },
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

  return {
    t,
    categoryStates,
    isPending: updatePreferences.isPending,
    handleToggle,
  }
}
