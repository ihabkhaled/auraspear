'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { FileText, Search, AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PageHeader, LoadingSpinner, EmptyState, Pagination, DataTable } from '@/components/common'
import { Input } from '@/components/ui/input'
import { SortOrder } from '@/enums'
import { useGraylogLogs, usePagination, useDebounce } from '@/hooks'
import { getErrorKey } from '@/lib/api-error'
import { formatDate } from '@/lib/utils'
import type { Column, GraylogLogEntry } from '@/types'

export default function ExplorerLogsPage() {
  const t = useTranslations('explorer')
  const tErrors = useTranslations()

  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<string | undefined>()
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC)
  const debouncedSearch = useDebounce(search, 400)
  const pagination = usePagination({ initialPage: 1, initialLimit: 20 })

  const resetPageRef = useRef(pagination.resetPage)
  useEffect(() => {
    resetPageRef.current = pagination.resetPage
  }, [pagination.resetPage])
  useEffect(() => {
    resetPageRef.current()
  }, [debouncedSearch])

  const { data, isLoading, isFetching, error } = useGraylogLogs({
    page: pagination.page,
    limit: pagination.limit,
    query: debouncedSearch || undefined,
    sortOrder,
  })

  useEffect(() => {
    if (data?.pagination) {
      pagination.setTotal(data.pagination.total)
    }
  }, [data?.pagination, pagination])

  const handleSort = useCallback(
    (key: string, order: SortOrder) => {
      pagination.setPage(1)
      setSortBy(key)
      setSortOrder(order)
    },
    [pagination]
  )

  const columns: Column<GraylogLogEntry>[] = [
    {
      key: 'timestamp',
      label: t('logs.timestamp'),
      sortable: true,
      defaultSortOrder: SortOrder.DESC,
      render: value => <span className="text-xs">{formatDate(value as string)}</span>,
    },
    {
      key: 'source',
      label: t('logs.source'),
      sortable: true,
    },
    {
      key: 'message',
      label: t('logs.message'),
      className: 'max-w-md truncate',
    },
    {
      key: 'priority',
      label: t('logs.priority'),
      sortable: true,
      render: value => <span className="font-mono text-xs">{String(value)}</span>,
    },
  ]

  if (error) {
    const errorKey = getErrorKey(error)
    return (
      <div className="space-y-6">
        <PageHeader title={t('logs.title')} description={t('logs.description')} />
        <div className="bg-status-warning border-status-warning flex items-center gap-2 rounded-lg border p-4">
          <AlertCircle className="text-status-warning h-5 w-5 shrink-0" />
          <p className="text-status-warning text-sm font-medium">{tErrors(errorKey)}</p>
        </div>
      </div>
    )
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageHeader title={t('logs.title')} description={t('logs.description')} />

      <div className="relative w-full sm:w-64">
        <Search className="text-muted-foreground absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('logs.searchPlaceholder')}
          className="ps-9"
        />
      </div>

      {(data?.data?.length ?? 0) === 0 && !isFetching ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title={t('logs.noLogs')}
          description={t('logs.noLogsDescription')}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data?.data ?? []}
            loading={isFetching}
            sortBy={sortBy}
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
