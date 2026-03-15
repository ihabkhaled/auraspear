'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { AlertTimelineEventType } from '@/enums'
import type { Alert, AlertTimelineEvent } from '@/types'

function getEventIcon(type: AlertTimelineEventType): string {
  switch (type) {
    case AlertTimelineEventType.CREATED:
      return 'plus-circle'
    case AlertTimelineEventType.ACKNOWLEDGED:
      return 'check-circle'
    case AlertTimelineEventType.CLOSED:
      return 'x-circle'
    case AlertTimelineEventType.ESCALATED:
      return 'alert-triangle'
    case AlertTimelineEventType.INVESTIGATED:
      return 'search'
    default:
      return 'circle'
  }
}

function getEventColor(type: AlertTimelineEventType): string {
  switch (type) {
    case AlertTimelineEventType.CREATED:
      return 'text-status-info'
    case AlertTimelineEventType.ACKNOWLEDGED:
      return 'text-status-warning'
    case AlertTimelineEventType.CLOSED:
    case AlertTimelineEventType.RESOLVED:
      return 'text-status-success'
    case AlertTimelineEventType.ESCALATED:
      return 'text-status-error'
    default:
      return 'text-muted-foreground'
  }
}

export function useAlertTimelineComponent(alert: Alert) {
  const t = useTranslations('alerts')

  const derivedTimeline = useMemo((): AlertTimelineEvent[] => {
    const events: AlertTimelineEvent[] = []

    events.push({
      id: `${alert.id}-created`,
      type: AlertTimelineEventType.CREATED,
      timestamp: alert.createdAt,
      actor: null,
      detail: t('timelineCreated'),
    })

    if (alert.acknowledgedAt) {
      events.push({
        id: `${alert.id}-acknowledged`,
        type: AlertTimelineEventType.ACKNOWLEDGED,
        timestamp: alert.acknowledgedAt,
        actor: alert.acknowledgedBy,
        detail: t('timelineAcknowledged'),
      })
    }

    if (alert.closedAt) {
      events.push({
        id: `${alert.id}-closed`,
        type: AlertTimelineEventType.CLOSED,
        timestamp: alert.closedAt,
        actor: alert.closedBy,
        detail: alert.resolution ?? t('timelineClosed'),
      })
    }

    return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }, [alert, t])

  return {
    t,
    derivedTimeline,
    getEventIcon,
    getEventColor,
  }
}
