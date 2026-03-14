'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Workflow, Search, RefreshCw, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  PageHeader,
  LoadingSpinner,
  EmptyState,
  Pagination,
  DataTable,
  Toast,
} from '@/components/common'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { SortOrder } from '@/enums'
import { useShuffleWorkflows, useSyncShuffle, usePagination, useDebounce } from '@/hooks'
import { getErrorKey } from '@/lib/api-error'
import { formatDate } from '@/lib/utils'
import type { Column, ShuffleWorkflow } from '@/types'

export default function ExplorerAutomationPage() {
  const t = useTranslations('explorer')
  const tErrors = useTranslations()

  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<string | undefined>()
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC)
  const debouncedSearch = useDebounce(search, 400)
  const pagination = usePagination({ initialPage: 1, initialLimit: 20 })

  const resetPageRef = useRef(pagination.resetPage)
  useEffect(() => {
    resetPageRef.current = pagination.resetPage
  }, [pagination.resetPage])
  useEffect(() => {
    resetPageRef.current()
  }, [debouncedSearch])

  const { data, isLoading, isFetching, error } = useShuffleWorkflows({
    page: pagination.page,
    limit: pagination.limit,
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder,
  })

  useEffect(() => {
    if (data?.pagination) {
      pagination.setTotal(data.pagination.total)
    }
  }, [data?.pagination, pagination])

  const syncMutation = useSyncShuffle()

  const handleSync = useCallback(() => {
    syncMutation.mutate(undefined, {
      onSuccess: result => {
        Toast.success(t('automation.syncSuccess', { count: result.data?.synced ?? 0 }))
      },
      onError: err => {
        Toast.error(tErrors(getErrorKey(err)))
      },
    })
  }, [syncMutation, t, tErrors])

  const handleSort = useCallback(
    (key: string, order: SortOrder) => {
      pagination.setPage(1)
      setSortBy(key)
      setSortOrder(order)
    },
    [pagination]
  )

  const columns: Column<ShuffleWorkflow>[] = [
    { key: 'name', label: t('automation.name'), sortable: true },
    {
      key: 'description',
      label: t('automation.workflowDescription'),
      className: 'max-w-sm truncate',
      render: value => (
        <span className="text-muted-foreground text-xs">{value ? String(value) : '—'}</span>
      ),
    },
    {
      key: 'isValid',
      label: t('automation.valid'),
      sortable: true,
      render: value =>
        value ? (
          <CheckCircle2 className="text-status-success h-4 w-4" />
        ) : (
          <XCircle className="text-status-error h-4 w-4" />
        ),
    },
    { key: 'triggerCount', label: t('automation.triggers'), sortable: true },
    {
      key: 'tags',
      label: t('automation.tags'),
      render: value => {
        const tags = value as string[]
        if (tags.length === 0) return <span className="text-muted-foreground">—</span>
        return (
          <div className="flex flex-wrap gap-1">
            {tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )
      },
    },
    {
      key: 'syncedAt',
      label: t('automation.syncedAt'),
      sortable: true,
      defaultSortOrder: SortOrder.DESC,
      render: value => <span className="text-xs">{formatDate(value as string)}</span>,
    },
  ]

  if (error) {
    const errorKey = getErrorKey(error)
    return (
      <div className="space-y-6">
        <PageHeader title={t('automation.title')} description={t('automation.description')} />
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
      <PageHeader
        title={t('automation.title')}
        description={t('automation.description')}
        action={{
          label: syncMutation.isPending ? t('automation.syncing') : t('automation.sync'),
          icon: (
            <RefreshCw className={syncMutation.isPending ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
          ),
          onClick: handleSync,
        }}
      />

      <div className="relative w-full sm:w-64">
        <Search className="text-muted-foreground absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('automation.searchPlaceholder')}
          className="ps-9"
        />
      </div>

      {(data?.data?.length ?? 0) === 0 && !isFetching ? (
        <EmptyState
          icon={<Workflow className="h-6 w-6" />}
          title={t('automation.noWorkflows')}
          description={t('automation.noWorkflowsDescription')}
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
