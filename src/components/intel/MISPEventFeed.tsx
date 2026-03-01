'use client'

import { useTranslations } from 'next-intl'
import { Globe } from 'lucide-react'
import { DataTable } from '@/components/common/DataTable'
import { Badge } from '@/components/ui/badge'
import { MISPTagPill } from './MISPTagPill'
import { formatRelativeTime } from '@/lib/utils'
import type { MISPEvent, MISPTag, Column } from '@/types'

interface MISPEventFeedProps {
  events: MISPEvent[]
  loading?: boolean
  onEventClick?: (event: MISPEvent) => void
}

function getThreatLevelVariant(level: string): 'destructive' | 'default' | 'secondary' | 'outline' {
  switch (level.toLowerCase()) {
    case 'high':
      return 'destructive'
    case 'medium':
      return 'default'
    case 'low':
      return 'secondary'
    default:
      return 'outline'
  }
}

function truncateInfo(info: string, maxLength = 60): string {
  if (info.length <= maxLength) {
    return info
  }
  return `${info.slice(0, maxLength)}...`
}

export function MISPEventFeed({ events, loading = false, onEventClick }: MISPEventFeedProps) {
  const t = useTranslations('intel')

  const columns: Column<MISPEvent>[] = [
    {
      key: 'eventId',
      label: t('misp.eventId'),
      className: 'font-mono text-xs',
    },
    {
      key: 'organization',
      label: t('misp.organization'),
    },
    {
      key: 'info',
      label: t('misp.info'),
      render: (value) => (
        <span className="text-sm" title={String(value ?? '')}>
          {truncateInfo(String(value ?? ''))}
        </span>
      ),
    },
    {
      key: 'threatLevel',
      label: t('misp.threatLevel'),
      render: (value) => (
        <Badge variant={getThreatLevelVariant(String(value ?? ''))}>
          {String(value ?? '')}
        </Badge>
      ),
    },
    {
      key: 'tags',
      label: t('misp.tags'),
      render: (value) => {
        const tags = value as MISPTag[] | undefined
        if (!tags || tags.length === 0) {
          return <span className="text-muted-foreground">-</span>
        }
        return (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map(tag => (
              <MISPTagPill key={tag.id} name={tag.name} />
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )
      },
    },
    {
      key: 'attributeCount',
      label: t('misp.attributes'),
      className: 'text-center',
      render: (value) => (
        <span className="font-mono text-sm">{String(value ?? '0')}</span>
      ),
    },
    {
      key: 'date',
      label: t('misp.lastUpdated'),
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {formatRelativeTime(String(value ?? ''))}
        </span>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={events}
      loading={loading}
      onRowClick={onEventClick}
      emptyMessage={t('misp.noEvents')}
      emptyIcon={<Globe className="h-6 w-6" />}
      emptyDescription={t('misp.noEventsDescription')}
    />
  )
}
