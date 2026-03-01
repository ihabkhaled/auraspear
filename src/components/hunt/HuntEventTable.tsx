'use client'

import { useTranslations } from 'next-intl'
import { Crosshair } from 'lucide-react'
import { DataTable } from '@/components/common/DataTable'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { formatTimestamp } from '@/lib/utils'
import type { Column } from '@/types'
import type { HuntEvent } from '@/types'
import type { AlertSeverity } from '@/enums'

interface HuntEventTableProps {
  events: HuntEvent[]
  loading?: boolean
}

export function HuntEventTable({ events, loading = false }: HuntEventTableProps) {
  const t = useTranslations('hunt')

  const columns: Column<HuntEvent>[] = [
    {
      key: 'timestamp',
      label: t('columnTimestamp'),
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">
          {formatTimestamp(value as string)}
        </span>
      ),
    },
    {
      key: 'severity',
      label: t('columnSeverity'),
      render: (value) => <SeverityBadge severity={value as AlertSeverity} />,
    },
    {
      key: 'eventId',
      label: t('columnEventId'),
      render: (value) => (
        <span className="font-mono text-xs">{value as string}</span>
      ),
    },
    {
      key: 'sourceIp',
      label: t('columnSourceIp'),
      render: (value) => (
        <span className="font-mono text-xs">{value as string}</span>
      ),
    },
    {
      key: 'user',
      label: t('columnUser'),
    },
    {
      key: 'description',
      label: t('columnDescription'),
      className: 'max-w-[300px] truncate',
    },
  ]

  return (
    <div className="px-4 pb-4">
      <DataTable
        columns={columns}
        data={events}
        loading={loading}
        emptyMessage={t('noEvents')}
        emptyIcon={<Crosshair className="h-6 w-6" />}
      />
    </div>
  )
}
