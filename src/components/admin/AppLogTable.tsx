'use client'

import { useTranslations } from 'next-intl'
import { DataTable } from '@/components/common/DataTable'
import { Badge } from '@/components/ui/badge'
import { formatTimestamp } from '@/lib/utils'
import type { ApplicationLogEntry, AppLogTableProps, Column } from '@/types'

function getLevelClasses(level: string): string {
  switch (level) {
    case 'error':
      return 'bg-status-error text-white border-status-error'
    case 'warn':
      return 'bg-status-warning text-white border-status-warning'
    case 'info':
      return 'bg-status-info text-white border-status-info'
    case 'debug':
      return 'bg-muted text-muted-foreground border-border'
    default:
      return ''
  }
}

export function AppLogTable({
  logs,
  loading = false,
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
}: AppLogTableProps) {
  const t = useTranslations('admin')

  const columns: Column<ApplicationLogEntry>[] = [
    {
      key: 'createdAt',
      label: t('appLogs.timestamp'),
      sortable: true,
      render: value => (
        <span className="font-mono text-xs">{formatTimestamp(String(value ?? ''))}</span>
      ),
    },
    {
      key: 'level',
      label: t('appLogs.level'),
      sortable: true,
      render: value => {
        const level = String(value ?? '')
        return (
          <Badge variant="outline" className={`text-xs uppercase ${getLevelClasses(level)}`}>
            {level}
          </Badge>
        )
      },
    },
    {
      key: 'feature',
      label: t('appLogs.feature'),
      sortable: true,
      render: value => <span className="text-sm font-medium">{String(value ?? '')}</span>,
    },
    {
      key: 'action',
      label: t('appLogs.action'),
      sortable: true,
    },
    {
      key: 'message',
      label: t('appLogs.message'),
      className: 'max-w-xs truncate',
    },
    {
      key: 'actorEmail',
      label: t('appLogs.actorEmail'),
      sortable: true,
      className: 'text-xs',
    },
    {
      key: 'outcome',
      label: t('appLogs.outcome'),
      sortable: true,
      render: value => {
        if (!value) return <span className="text-muted-foreground">&mdash;</span>
        return <span className="text-xs">{String(value)}</span>
      },
    },
    {
      key: 'sourceType',
      label: t('appLogs.sourceType'),
      className: 'text-xs',
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={logs}
      loading={loading}
      emptyMessage={t('appLogs.noLogs')}
      emptyDescription={t('appLogs.noLogsDescription')}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
      onRowClick={onRowClick}
    />
  )
}
