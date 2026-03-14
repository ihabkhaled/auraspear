'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Shield, Search, AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PageHeader, LoadingSpinner, EmptyState, Pagination, DataTable } from '@/components/common'
import { Input } from '@/components/ui/input'
import { SortOrder } from '@/enums'
import { useMispExplorerEvents, usePagination, useDebounce } from '@/hooks'
import { getErrorKey } from '@/lib/api-error'
import type { Column, MispEventRow } from '@/types'

export default function ExplorerThreatIntelPage() {
  const t = useTranslations('explorer')
  const tErrors = useTranslations()

  const [search, setSearch] = useState('')
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

  const { data, isLoading, isFetching, error } = useMispExplorerEvents({
    page: pagination.page,
    limit: pagination.limit,
    value: debouncedSearch || undefined,
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

  const columns: Column<MispEventRow>[] = [
    {
      key: 'id',
      label: t('threatIntel.eventId'),
    },
    {
      key: 'info',
      label: t('threatIntel.info'),
      className: 'max-w-sm truncate',
    },
    {
      key: 'date',
      label: t('threatIntel.date'),
      sortable: true,
      defaultSortOrder: SortOrder.DESC,
    },
    {
      key: 'threat_level_id',
      label: t('threatIntel.threatLevel'),
    },
    {
      key: 'Orgc',
      label: t('threatIntel.org'),
      render: value => {
        const org = value as MispEventRow['Orgc']
        return <span>{org?.name ?? '—'}</span>
      },
    },
    {
      key: 'attribute_count',
      label: t('threatIntel.attributes'),
    },
  ]

  if (error) {
    const errorKey = getErrorKey(error)
    return (
      <div className="space-y-6">
        <PageHeader title={t('threatIntel.title')} description={t('threatIntel.description')} />
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
      <PageHeader title={t('threatIntel.title')} description={t('threatIntel.description')} />

      <div className="relative w-full sm:w-64">
        <Search className="text-muted-foreground absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('threatIntel.searchPlaceholder')}
          className="ps-9"
        />
      </div>

      {(data?.data?.length ?? 0) === 0 && !isFetching ? (
        <EmptyState
          icon={<Shield className="h-6 w-6" />}
          title={t('threatIntel.noEvents')}
          description={t('threatIntel.noEventsDescription')}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={(data?.data ?? []) as MispEventRow[]}
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
