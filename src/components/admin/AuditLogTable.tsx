'use client'

import { useTranslations } from 'next-intl'
import { ScrollText } from 'lucide-react'
import { DataTable } from '@/components/common/DataTable'
import { formatTimestamp } from '@/lib/utils'
import type { AuditLogEntry, Column } from '@/types'

interface AuditLogTableProps {
  logs: AuditLogEntry[]
  loading?: boolean
}

export function AuditLogTable({ logs, loading = false }: AuditLogTableProps) {
  const t = useTranslations('admin')

  const columns: Column<AuditLogEntry>[] = [
    {
      key: 'timestamp',
      label: t('audit.timestamp'),
      render: (value) => (
        <span className="font-mono text-xs">{formatTimestamp(String(value ?? ''))}</span>
      ),
    },
    {
      key: 'actor',
      label: t('audit.actor'),
    },
    {
      key: 'action',
      label: t('audit.action'),
      render: (value) => (
        <span className="text-sm font-medium">{String(value ?? '')}</span>
      ),
    },
    {
      key: 'resource',
      label: t('audit.resource'),
    },
    {
      key: 'resourceId',
      label: t('audit.resourceId'),
      className: 'font-mono text-xs',
    },
    {
      key: 'ipAddress',
      label: t('audit.ipAddress'),
      className: 'font-mono text-xs',
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={logs}
      loading={loading}
      emptyMessage={t('audit.noLogs')}
      emptyIcon={<ScrollText className="h-6 w-6" />}
      emptyDescription={t('audit.noLogsDescription')}
    />
  )
}
