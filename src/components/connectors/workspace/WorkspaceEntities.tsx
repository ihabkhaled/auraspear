'use client'

import { DataTable } from '@/components/common/DataTable'
import { Pagination } from '@/components/common/Pagination'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WorkspaceEntityStatus } from '@/enums'
import { useWorkspaceEntitiesComponent } from '@/hooks/useWorkspaceEntitiesComponent'
import { cn, formatTimestamp } from '@/lib/utils'
import type { Column, WorkspaceEntity, WorkspaceEntitiesProps } from '@/types'

export function WorkspaceEntities({
  entities,
  total,
  page,
  pageSize,
  loading,
  onPageChange,
}: WorkspaceEntitiesProps) {
  const { t } = useWorkspaceEntitiesComponent()
  const totalPages = Math.ceil(total / pageSize)

  const columns: Column<WorkspaceEntity>[] = [
    {
      key: 'name',
      label: t('entityName'),
      render: (_value, row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: 'type',
      label: t('entityType'),
      render: value => (
        <Badge variant="outline" className="text-xs">
          {value as string}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: t('entityStatus'),
      render: value => {
        const status = value as string | undefined
        if (!status) return null
        const statusClass =
          status === WorkspaceEntityStatus.ACTIVE ||
          status === WorkspaceEntityStatus.SEEN ||
          status === WorkspaceEntityStatus.AVAILABLE ||
          status === WorkspaceEntityStatus.PUBLISHED
            ? 'bg-status-success text-white border-status-success'
            : status === WorkspaceEntityStatus.INACTIVE || status === WorkspaceEntityStatus.DRAFT
              ? 'bg-status-warning text-white border-status-warning'
              : ''
        return (
          <Badge variant="outline" className={cn('text-xs', statusClass)}>
            {status}
          </Badge>
        )
      },
    },
    {
      key: 'lastSeen',
      label: t('lastSeen'),
      render: value => {
        const ts = value as string | undefined
        return ts ? (
          <span className="text-muted-foreground text-xs">{formatTimestamp(ts)}</span>
        ) : null
      },
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          {t('entities')} ({total})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataTable
          columns={columns}
          data={entities}
          loading={Boolean(loading)}
          emptyMessage={t('noEntities')}
        />
        {totalPages > 1 && onPageChange && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            total={total}
          />
        )}
      </CardContent>
    </Card>
  )
}
