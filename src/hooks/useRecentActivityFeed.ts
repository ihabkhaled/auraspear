import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import type { RecentActivityItem } from '@/types'
import { useRecentActivity } from './useDashboard'

export function useRecentActivityFeed() {
  const t = useTranslations('dashboard')
  const { data, isLoading } = useRecentActivity()

  const items: RecentActivityItem[] = useMemo(() => {
    const rawItems = data?.data
    if (!Array.isArray(rawItems)) {
      return []
    }
    return rawItems.map(item => ({
      id: item.id,
      type: item.type,
      actorName: item.actorName,
      title: item.title,
      message: item.message,
      createdAt: item.createdAt,
      isRead: item.isRead,
    }))
  }, [data?.data])

  return {
    t,
    items,
    isLoading,
  }
}
