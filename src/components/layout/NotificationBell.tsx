'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell,
  BellOff,
  Building2,
  CheckCheck,
  ClipboardList,
  FileText,
  MessageSquare,
  Pencil,
  Shield,
  ShieldOff,
  ToggleRight,
  UserCheck,
  UserMinus,
  UserPlus,
  UserX,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LoadingSpinner, Toast } from '@/components/common'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { NotificationType } from '@/enums'
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationSocket,
  useNotifications,
  useUnreadNotificationCount,
} from '@/hooks'
import { getErrorKey } from '@/lib/api-error'
import { cn, formatRelativeTime } from '@/lib/utils'
import type { NotificationItem } from '@/types'

function getNotificationIcon(type: string) {
  switch (type) {
    case NotificationType.MENTION:
      return <MessageSquare className="h-4 w-4" />
    case NotificationType.CASE_ASSIGNED:
      return <UserPlus className="h-4 w-4" />
    case NotificationType.CASE_UNASSIGNED:
      return <UserMinus className="h-4 w-4" />
    case NotificationType.CASE_COMMENT_ADDED:
      return <MessageSquare className="h-4 w-4" />
    case NotificationType.CASE_TASK_ADDED:
      return <ClipboardList className="h-4 w-4" />
    case NotificationType.CASE_ARTIFACT_ADDED:
      return <FileText className="h-4 w-4" />
    case NotificationType.CASE_STATUS_CHANGED:
      return <ToggleRight className="h-4 w-4" />
    case NotificationType.CASE_UPDATED:
      return <Pencil className="h-4 w-4" />
    case NotificationType.TENANT_ASSIGNED:
      return <Building2 className="h-4 w-4" />
    case NotificationType.ROLE_CHANGED:
      return <Shield className="h-4 w-4" />
    case NotificationType.USER_BLOCKED:
      return <ShieldOff className="h-4 w-4" />
    case NotificationType.USER_UNBLOCKED:
      return <UserCheck className="h-4 w-4" />
    case NotificationType.USER_REMOVED:
      return <UserX className="h-4 w-4" />
    case NotificationType.USER_RESTORED:
      return <UserCheck className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

function getNotificationIconColor(type: string): string {
  switch (type) {
    case NotificationType.USER_BLOCKED:
    case NotificationType.USER_REMOVED:
      return 'bg-destructive/10 text-destructive'
    case NotificationType.USER_UNBLOCKED:
    case NotificationType.USER_RESTORED:
    case NotificationType.CASE_ASSIGNED:
      return 'bg-status-success text-status-success'
    case NotificationType.CASE_STATUS_CHANGED:
      return 'bg-status-warning text-status-warning'
    case NotificationType.CASE_UNASSIGNED:
      return 'bg-status-warning text-status-warning'
    case NotificationType.TENANT_ASSIGNED:
    case NotificationType.CASE_COMMENT_ADDED:
    case NotificationType.CASE_TASK_ADDED:
    case NotificationType.CASE_ARTIFACT_ADDED:
    case NotificationType.CASE_UPDATED:
      return 'bg-status-info text-status-info'
    case NotificationType.ROLE_CHANGED:
      return 'bg-status-warning text-status-warning'
    default:
      return 'bg-primary/10 text-primary'
  }
}

export function NotificationBell() {
  const t = useTranslations('notifications')
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const { data: unreadData } = useUnreadNotificationCount()
  const unreadCount = unreadData?.count ?? 0

  // Real-time notifications via WebSocket
  useNotificationSocket()

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useNotifications()

  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const allNotifications: NotificationItem[] = data?.pages.flatMap(page => page.data) ?? []

  // Infinite scroll inside the notification list
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const target = loadMoreRef.current
    const root = scrollContainerRef.current
    if (!target || !root || !open) return

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { root, threshold: 0.1 }
    )

    observer.observe(target)
    return () => {
      observer.disconnect()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, open])

  const handleNotificationClick = useCallback(
    (notification: NotificationItem) => {
      // Mark as read
      if (!notification.isRead) {
        markRead.mutate(notification.id, {
          onError: (error: unknown) => {
            Toast.error(t(getErrorKey(error)))
          },
        })
      }

      // Navigate to case with comment anchor
      if (notification.caseId) {
        const commentAnchor = notification.caseCommentId
          ? `#comment-${notification.caseCommentId}`
          : ''
        setOpen(false)
        router.push(`/cases/${notification.caseId}${commentAnchor}`)
      }
    },
    [markRead, router, t]
  )

  const handleMarkAllRead = useCallback(() => {
    markAllRead.mutate(undefined, {
      onSuccess: () => {
        Toast.success(t('allMarkedRead'))
      },
      onError: (error: unknown) => {
        Toast.error(t(getErrorKey(error)))
      },
    })
  }, [markAllRead, t])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative overflow-visible">
          <Bell className="text-muted-foreground h-4 w-4" />
          {unreadCount > 0 && (
            <span className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] leading-none font-bold shadow-sm">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-96 p-0">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">{t('title')}</h3>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-xs">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={handleMarkAllRead}
              disabled={markAllRead.isPending}
            >
              <CheckCheck className="me-1 h-3.5 w-3.5" />
              {t('markAllRead')}
            </Button>
          )}
        </div>

        {/* Notification list */}
        <div ref={scrollContainerRef} className="max-h-[400px] overflow-y-auto">
          {isLoading && (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          )}

          {!isLoading && allNotifications.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-8">
              <BellOff className="text-muted-foreground h-8 w-8" />
              <p className="text-muted-foreground text-sm">{t('empty')}</p>
            </div>
          )}

          {allNotifications.map(notification => (
            <button
              key={notification.id}
              type="button"
              className={cn(
                'hover:bg-muted/50 flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-start transition-colors',
                !notification.isRead && 'bg-primary/5'
              )}
              onClick={() => handleNotificationClick(notification)}
            >
              <div
                className={cn(
                  'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  getNotificationIconColor(notification.type)
                )}
              >
                {getNotificationIcon(notification.type)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{notification.actorName}</p>
                  {!notification.isRead && (
                    <span className="bg-primary mt-1.5 h-2 w-2 shrink-0 rounded-full" />
                  )}
                </div>
                <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
                  {notification.message}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {formatRelativeTime(notification.createdAt)}
                </p>
              </div>
            </button>
          ))}

          {/* Load more trigger */}
          <div ref={loadMoreRef} className="h-1" />

          {isFetchingNextPage && (
            <div className="flex justify-center py-2">
              <LoadingSpinner />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
