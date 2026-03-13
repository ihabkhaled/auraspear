'use client'

import { useTranslations } from 'next-intl'
import { DataTable } from '@/components/common/DataTable'
import type { CaseCycleStatus, SortOrder } from '@/enums'
import { formatDate } from '@/lib/utils'
import type { CaseCycle, Column } from '@/types'
import { CycleBadge } from './CycleBadge'

interface CycleHistoryTableProps {
  cycles: CaseCycle[]
  onCycleClick?: (cycle: CaseCycle) => void
  loading?: boolean
  sortBy?: string | undefined
  sortOrder?: SortOrder | undefined
  onSort?: ((key: string, order: SortOrder) => void) | undefined
}

export function CycleHistoryTable({
  cycles,
  onCycleClick,
  loading,
  sortBy,
  sortOrder,
  onSort,
}: CycleHistoryTableProps) {
  const t = useTranslations('cases.cycles')

  const columns: Column<CaseCycle>[] = [
    {
      key: 'name',
      label: t('name'),
      sortable: true,
    },
    {
      key: 'status',
      label: t('status'),
      sortable: true,
      render: (value: unknown) => <CycleBadge status={value as CaseCycleStatus} />,
    },
    {
      key: 'startDate',
      label: t('startDate'),
      sortable: true,
      render: (value: unknown) => (value ? formatDate(value as string) : '—'),
    },
    {
      key: 'endDate',
      label: t('endDate'),
      sortable: true,
      render: (value: unknown) => (value ? formatDate(value as string) : '—'),
    },
    {
      key: 'caseCount',
      label: t('caseCount'),
    },
    {
      key: 'openCount',
      label: t('openCount'),
    },
    {
      key: 'closedCount',
      label: t('closedCount'),
    },
    {
      key: 'createdAt',
      label: t('createdAt'),
      sortable: true,
      render: (value: unknown) => formatDate(value as string),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={cycles}
      emptyMessage={t('noCycles')}
      loading={loading ?? false}
      onRowClick={onCycleClick}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
    />
  )
}
