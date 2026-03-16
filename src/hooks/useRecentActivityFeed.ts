import { useCallback, useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { resolveNotificationMessage } from '@/lib/constants/notifications'
import type { RecentActivityItem } from '@/types'
import { useRecentActivity } from './useDashboard'

const DASHBOARD_ACTIVITY_LIMIT = 5

export function useRecentActivityFeed() {
  const t = useTranslations('dashboard')
  const tNotifications = useTranslations('notifications')
  const tMessages = useTranslations('notifications.messages')
  const locale = useLocale()
  const { data, isLoading } = useRecentActivity()

  const items: RecentActivityItem[] = useMemo(() => {
    const rawItems = data?.data
    if (!Array.isArray(rawItems)) {
      return []
    }
    return rawItems.slice(0, DASHBOARD_ACTIVITY_LIMIT).map(item => ({
      id: item.id,
      type: item.type,
      actorName: item.actorName,
      title: item.title,
      message: item.message,
      createdAt: item.createdAt,
      isRead: item.isRead,
    }))
  }, [data?.data])

  const resolveMessage = useCallback(
    (message: string) => resolveNotificationMessage(message, tMessages),
    [tMessages]
  )

  return {
    t,
    tNotifications,
    locale,
    items,
    isLoading,
    resolveMessage,
  }
}
