'use client'

import { useTranslations } from 'next-intl'
import { DataTable } from '@/components/common/DataTable'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { Badge } from '@/components/ui/badge'
import { type CaseStatus, type CaseSeverity } from '@/enums'
import { STATUS_VARIANT_MAP } from '@/lib/case.utils'
import { CASE_STATUS_LABEL_KEYS } from '@/lib/constants/cases'
import { formatDate } from '@/lib/utils'
import type { Case, CaseListTableProps, Column } from '@/types'

export function CaseListTable({
  cases,
  onCaseClick,
  loading = false,
  sortBy,
  sortOrder,
  onSort,
}: CaseListTableProps) {
  const t = useTranslations('cases')

  const columns: Column<Case>[] = [
    {
      key: 'caseNumber',
      label: t('caseNumber'),
      className: 'font-mono text-xs',
    },
    {
      key: 'title',
      label: t('fieldTitle'),
    },
    {
      key: 'status',
      label: t('fieldStatus'),
      sortable: true,
      render: value => {
        const status = value as CaseStatus
        const labelKey = CASE_STATUS_LABEL_KEYS[status]
        return (
          <Badge variant={STATUS_VARIANT_MAP[status]} className="capitalize">
            {labelKey ? t(labelKey) : String(value ?? '')}
          </Badge>
        )
      },
    },
    {
      key: 'severity',
      label: t('fieldSeverity'),
      sortable: true,
      render: value => <SeverityBadge severity={value as CaseSeverity} />,
    },
    {
      key: 'createdBy',
      label: t('fieldAssignee'),
    },
    {
      key: 'createdAt',
      label: t('created'),
      sortable: true,
      render: value => (
        <span className="text-muted-foreground text-xs">{formatDate(String(value ?? ''))}</span>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={cases}
      loading={loading}
      emptyMessage={t('noCases')}
      onRowClick={onCaseClick}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
    />
  )
}
