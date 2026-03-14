'use client'

import { useState, useCallback, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PageHeader, LoadingSpinner, EmptyState, Pagination, DataTable } from '@/components/common'
import { Badge } from '@/components/ui/badge'
import { SortOrder, SyncJobStatus } from '@/enums'
import { useSyncJobs, usePagination } from '@/hooks'
import { formatDate } from '@/lib/utils'
import type { Column, SyncJob } from '@/types'

function statusVariant(status: string) {
  switch (status) {
    case SyncJobStatus.RUNNING:
      return 'default' as const
    case SyncJobStatus.COMPLETED:
      return 'outline' as const
    case SyncJobStatus.FAILED:
      return 'destructive' as const
    default:
      return 'secondary' as const
  }
}

export default function ExplorerSyncJobsPage() {
  const t = useTranslations('explorer')

  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC)
  const pagination = usePagination({ initialPage: 1, initialLimit: 20 })

  const { data, isLoading, isFetching } = useSyncJobs({
    page: pagination.page,
    limit: pagination.limit,
    sortOrder,
  })

  useEffect(() => {
    if (data?.pagination) {
      pagination.setTotal(data.pagination.total)
    }
  }, [data?.pagination, pagination])

  const handleSort = useCallback(
    (_key: string, order: SortOrder) => {
      pagination.setPage(1)
      setSortOrder(order)
    },
    [pagination]
  )

  const columns: Column<SyncJob>[] = [
    {
      key: 'connectorType',
      label: t('syncJobs.connector'),
      render: value => (
        <Badge variant="outline" className="uppercase">
          {String(value)}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: t('syncJobs.status'),
      render: value => <Badge variant={statusVariant(String(value))}>{String(value)}</Badge>,
    },
    { key: 'recordsSynced', label: t('syncJobs.synced') },
    { key: 'recordsFailed', label: t('syncJobs.failed') },
    {
      key: 'durationMs',
      label: t('syncJobs.duration'),
      render: value => {
        if (value === null || value === undefined) {
          return <span className="text-muted-foreground">—</span>
        }
        const ms = Number(value)
        return (
          <span className="text-xs">{ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`}</span>
        )
      },
    },
    { key: 'initiatedBy', label: t('syncJobs.initiatedBy') },
    {
      key: 'startedAt',
      label: t('syncJobs.startedAt'),
      sortable: true,
      defaultSortOrder: SortOrder.DESC,
      render: value => <span className="text-xs">{formatDate(value as string)}</span>,
    },
    {
      key: 'errorMessage',
      label: t('syncJobs.error'),
      className: 'max-w-xs truncate',
      render: value =>
        value ? (
          <span className="text-status-error text-xs">{String(value)}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
  ]

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageHeader title={t('syncJobs.title')} description={t('syncJobs.description')} />

      {(data?.data?.length ?? 0) === 0 && !isFetching ? (
        <EmptyState
          icon={<Clock className="h-6 w-6" />}
          title={t('syncJobs.noJobs')}
          description={t('syncJobs.noJobsDescription')}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data?.data ?? []}
            loading={isFetching}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={pagination.setPage}
            total={pagination.total}
          />
        </>
      )}
    </div>
  )
}
