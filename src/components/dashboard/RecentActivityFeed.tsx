'use client'

import { Bell, MessageSquare, AlertTriangle, Shield, Clock } from 'lucide-react'
import { EmptyState, LoadingSpinner } from '@/components/common'
import { Button } from '@/components/ui/button'
import { useRecentActivityFeed } from '@/hooks/useRecentActivityFeed'
import { cn, formatRelativeTime } from '@/lib/utils'
import type { RecentActivityItem } from '@/types'

function getActivityIcon(type: string) {
  switch (type) {
    case 'comment':
    case 'mention':
      return <MessageSquare className="h-4 w-4" />
    case 'alert':
      return <AlertTriangle className="h-4 w-4" />
    case 'case':
      return <Shield className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

function ActivityItem({ item }: { item: RecentActivityItem }) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg p-3 transition-colors',
        item.isRead ? 'opacity-70' : 'bg-muted/50'
      )}
    >
      <div className="text-muted-foreground mt-0.5 shrink-0">{getActivityIcon(item.type)}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{item.title}</p>
        <p className="text-muted-foreground line-clamp-1 text-xs">{item.message}</p>
        <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
          <Clock className="h-3 w-3" />
          <span>{formatRelativeTime(item.createdAt)}</span>
          <span className="text-border">|</span>
          <span>{item.actorName}</span>
        </div>
      </div>
    </div>
  )
}

export function RecentActivityFeed() {
  const { t, items, isLoading } = useRecentActivityFeed()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Bell className="h-6 w-6" />}
        title={t('noRecentActivity')}
        description={t('noRecentActivityDescription')}
      />
    )
  }

  return (
    <div className="space-y-1">
      {items.map(item => (
        <ActivityItem key={item.id} item={item} />
      ))}
      <div className="flex justify-end pt-2">
        <Button variant="ghost" size="sm" asChild>
          <a href="/notifications">{t('viewAll')}</a>
        </Button>
      </div>
    </div>
  )
}
