import { useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { NotificationCategory } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { lookup } from '@/lib/utils'
import { usePreferences, useUpdatePreferences } from './useSettings'

const NOTIFICATION_CATEGORIES = [
  NotificationCategory.CRITICAL_ALERTS,
  NotificationCategory.HIGH_ALERTS,
  NotificationCategory.CASE_ASSIGNMENTS,
  NotificationCategory.CASE_UPDATES,
  NotificationCategory.CASE_COMMENTS,
  NotificationCategory.CASE_ACTIVITY,
  NotificationCategory.INCIDENT_UPDATES,
  NotificationCategory.COMPLIANCE_ALERTS,
  NotificationCategory.USER_MANAGEMENT,
] as const

const CATEGORY_TO_PREF_KEY: Record<NotificationCategory, string> = {
  [NotificationCategory.CRITICAL_ALERTS]: 'notifyCriticalAlerts',
  [NotificationCategory.HIGH_ALERTS]: 'notifyHighAlerts',
  [NotificationCategory.CASE_ASSIGNMENTS]: 'notifyCaseAssignments',
  [NotificationCategory.CASE_UPDATES]: 'notifyCaseUpdates',
  [NotificationCategory.CASE_COMMENTS]: 'notifyCaseComments',
  [NotificationCategory.CASE_ACTIVITY]: 'notifyCaseActivity',
  [NotificationCategory.INCIDENT_UPDATES]: 'notifyIncidentUpdates',
  [NotificationCategory.COMPLIANCE_ALERTS]: 'notifyComplianceAlerts',
  [NotificationCategory.USER_MANAGEMENT]: 'notifyUserManagement',
}

export function useNotificationPreferences() {
  const t = useTranslations('settings')
  const tErrors = useTranslations()
  const { data: preferences } = usePreferences()
  const updatePreferences = useUpdatePreferences()

  const categoryStates = useMemo(
    () =>
      NOTIFICATION_CATEGORIES.map(category => ({
        category,
        enabled: Boolean(preferences?.[lookup(CATEGORY_TO_PREF_KEY, category)] ?? true),
      })),
    [preferences]
  )

  const handleToggle = useCallback(
    (category: NotificationCategory, checked: boolean) => {
      updatePreferences.mutate(
        { [lookup(CATEGORY_TO_PREF_KEY, category)]: checked },
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
