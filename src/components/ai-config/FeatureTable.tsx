'use client'

import { Pen } from 'lucide-react'
import { DataTable } from '@/components/common'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { AiFeatureConfig, Column, FeatureTableProps } from '@/types'

export function FeatureTable({ features, loading, onEdit, t }: FeatureTableProps) {
  // Columns contain JSX render functions — acceptable inline per CLAUDE.md rule 33
  const columns: Column<AiFeatureConfig>[] = [
    { key: 'featureKey', label: t('featureKey') },
    {
      key: 'enabled',
      label: t('featureEnabled'),
      render: (value: unknown) => (
        <Badge variant={value ? 'success' : 'secondary'}>
          {value ? t('enabled') : t('disabled')}
        </Badge>
      ),
    },
    {
      key: 'preferredProvider',
      label: t('featureProvider'),
      render: (value: unknown) => <span>{(value as string) ?? '-'}</span>,
    },
    { key: 'maxTokens', label: t('featureMaxTokens') },
    { key: 'approvalLevel', label: t('featureApproval') },
    {
      key: 'monthlyTokenBudget',
      label: t('featureBudget'),
      render: (value: unknown) => (
        <span>{value !== null && value !== undefined ? String(value) : '-'}</span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (_value: unknown, row: AiFeatureConfig) => (
        <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
          <Pen className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ]

  return (
    <DataTable columns={columns} data={features} emptyMessage={t('noFeatures')} loading={loading} keyField="featureKey" />
  )
}
