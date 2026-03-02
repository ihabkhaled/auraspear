'use client'

import { useTranslations } from 'next-intl'
import { DataTable } from '@/components/common/DataTable'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { Badge } from '@/components/ui/badge'
import { CaseStatus } from '@/enums'
import type { CaseSeverity } from '@/enums'
import { STATUS_VARIANT_MAP } from '@/lib/case.utils'
import { formatDate } from '@/lib/utils'
import type { Case, Column } from '@/types'

interface CaseListTableProps {
  cases: Case[]
  onCaseClick?: (caseItem: Case) => void
  loading?: boolean
}

const STATUS_LABEL_KEYS: Record<CaseStatus, string> = {
  [CaseStatus.OPEN]: 'statusOpen',
  [CaseStatus.IN_PROGRESS]: 'statusInProgress',
  [CaseStatus.CLOSED]: 'statusClosed',
}

export function CaseListTable({ cases, onCaseClick, loading = false }: CaseListTableProps) {
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
      render: value => {
        const status = value as CaseStatus
        const labelKey = STATUS_LABEL_KEYS[status]
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
      render: value => <SeverityBadge severity={value as CaseSeverity} />,
    },
    {
      key: 'assignee',
      label: t('fieldAssignee'),
    },
    {
      key: 'createdAt',
      label: t('created'),
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
    />
  )
}
