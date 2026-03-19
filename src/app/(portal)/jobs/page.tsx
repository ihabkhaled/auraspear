'use client'

import { Clock3, RefreshCcw, XCircle } from 'lucide-react'
import { DataTable, EmptyState, LoadingSpinner, PageHeader, Pagination } from '@/components/common'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useJobsPage } from '@/hooks'
import { JOB_STATUS_FILTER_OPTIONS, JOB_TYPE_FILTER_OPTIONS } from '@/lib/constants/jobs'
import {
  getJobStatusBadgeVariant,
  isCancellableJobStatus,
  isRetryableJobStatus,
} from '@/lib/job.utils'
import type { Column, JobRecord } from '@/types'

export default function JobsPage() {
  const {
    t,
    allFilterValue,
    pagination,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    data,
    stats,
    isLoading,
    isFetching,
    isMutating,
    canManage,
    handleRetry,
    handleCancel,
    isJobStatus,
    isJobType,
  } = useJobsPage()

  const columns: Column<JobRecord>[] = [
    {
      key: 'type',
      label: t('columns.type'),
      render: value => (
        <Badge variant="outline" className="uppercase">
          {String(value).replaceAll('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: t('columns.status'),
      render: value => (
        <Badge variant={getJobStatusBadgeVariant(value as JobRecord['status'])}>
          {String(value)}
        </Badge>
      ),
    },
    {
      key: 'attempts',
      label: t('columns.attempts'),
      render: (value, row) => (
        <span className="font-mono text-xs">{`${String(value)} / ${row.maxAttempts}`}</span>
      ),
    },
    {
      key: 'createdBy',
      label: t('columns.createdBy'),
      render: value => <span className="text-xs">{String(value ?? '—')}</span>,
    },
    {
      key: 'createdAt',
      label: t('columns.createdAt'),
      render: value => (
        <span className="text-muted-foreground text-xs">
          {new Date(String(value)).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'scheduledAt',
      label: t('columns.scheduledAt'),
      render: value => (
        <span className="text-muted-foreground text-xs">
          {value ? new Date(String(value)).toLocaleString() : '—'}
        </span>
      ),
    },
    {
      key: 'error',
      label: t('columns.error'),
      className: 'max-w-[240px]',
      render: value =>
        value ? <span className="text-status-error text-xs">{String(value)}</span> : <span>—</span>,
    },
    {
      key: 'actions',
      label: t('columns.actions'),
      className: 'w-36',
      render: (_value, row) =>
        canManage ? (
          <div className="flex items-center gap-2">
            {isRetryableJobStatus(row.status) ? (
              <Button
                variant="outline"
                size="sm"
                disabled={isMutating}
                onClick={() => handleRetry(row.id)}
                className="gap-1.5"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                {t('retry')}
              </Button>
            ) : null}
            {isCancellableJobStatus(row.status) ? (
              <Button
                variant="ghost"
                size="sm"
                disabled={isMutating}
                onClick={() => handleCancel(row.id)}
                className="gap-1.5"
              >
                <XCircle className="h-3.5 w-3.5" />
                {t('cancel')}
              </Button>
            ) : null}
          </div>
        ) : null,
    },
  ]

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('kpis.total')}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats?.data.total ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('kpis.running')}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats?.data.running ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('kpis.retrying')}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats?.data.retrying ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('kpis.failed')}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats?.data.failed ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('kpis.delayed')}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats?.data.delayed ?? 0}</CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row">
        <Select
          value={statusFilter ?? allFilterValue}
          onValueChange={value => setStatusFilter(isJobStatus(value) ? value : undefined)}
        >
          <SelectTrigger className="w-full md:w-56">
            <SelectValue placeholder={t('filters.status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={allFilterValue}>{t('filters.allStatuses')}</SelectItem>
            {JOB_STATUS_FILTER_OPTIONS.map(jobStatus => (
              <SelectItem key={jobStatus} value={jobStatus}>
                {t(`status.${jobStatus}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={typeFilter ?? allFilterValue}
          onValueChange={value => setTypeFilter(isJobType(value) ? value : undefined)}
        >
          <SelectTrigger className="w-full md:w-64">
            <SelectValue placeholder={t('filters.type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={allFilterValue}>{t('filters.allTypes')}</SelectItem>
            {JOB_TYPE_FILTER_OPTIONS.map(jobType => (
              <SelectItem key={jobType} value={jobType}>
                {t(`types.${jobType}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(data?.data?.length ?? 0) === 0 && !isFetching ? (
        <EmptyState
          icon={<Clock3 className="h-6 w-6" />}
          title={t('emptyTitle')}
          description={t('emptyDescription')}
        />
      ) : (
        <>
          <DataTable columns={columns} data={data?.data ?? []} loading={isFetching} />
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
