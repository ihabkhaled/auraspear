'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Monitor, Search, RefreshCw, AlertCircle } from 'lucide-react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SortOrder } from '@/enums'
import {
  useVelociraptorEndpoints,
  useVelociraptorHunts,
  useSyncVelociraptor,
  usePagination,
  useDebounce,
} from '@/hooks'
import { getErrorKey } from '@/lib/api-error'
import { formatDate } from '@/lib/utils'
import type { Column, VelociraptorEndpoint, VelociraptorHunt } from '@/types'

export default function ExplorerEndpointsPage() {
  const t = useTranslations('explorer')
  const tErrors = useTranslations()
  const [activeTab, setActiveTab] = useState<'endpoints' | 'hunts'>('endpoints')

  // Endpoints state
  const [endpointSearch, setEndpointSearch] = useState('')
  const [endpointSortBy, setEndpointSortBy] = useState<string | undefined>()
  const [endpointSortOrder, setEndpointSortOrder] = useState<SortOrder>(SortOrder.ASC)
  const debouncedEndpointSearch = useDebounce(endpointSearch, 400)
  const endpointPagination = usePagination({ initialPage: 1, initialLimit: 20 })

  const endpointResetRef = useRef(endpointPagination.resetPage)
  useEffect(() => {
    endpointResetRef.current = endpointPagination.resetPage
  }, [endpointPagination.resetPage])
  useEffect(() => {
    endpointResetRef.current()
  }, [debouncedEndpointSearch])

  // Hunts state
  const [huntSearch, setHuntSearch] = useState('')
  const [huntSortBy, setHuntSortBy] = useState<string | undefined>()
  const [huntSortOrder, setHuntSortOrder] = useState<SortOrder>(SortOrder.DESC)
  const debouncedHuntSearch = useDebounce(huntSearch, 400)
  const huntPagination = usePagination({ initialPage: 1, initialLimit: 20 })

  const huntResetRef = useRef(huntPagination.resetPage)
  useEffect(() => {
    huntResetRef.current = huntPagination.resetPage
  }, [huntPagination.resetPage])
  useEffect(() => {
    huntResetRef.current()
  }, [debouncedHuntSearch])

  const {
    data: endpointsData,
    isLoading: endpointsLoading,
    isFetching: endpointsFetching,
    error: endpointsError,
  } = useVelociraptorEndpoints({
    page: endpointPagination.page,
    limit: endpointPagination.limit,
    search: debouncedEndpointSearch || undefined,
    sortBy: endpointSortBy,
    sortOrder: endpointSortOrder,
  })

  const {
    data: huntsData,
    isLoading: huntsLoading,
    isFetching: huntsFetching,
    error: huntsError,
  } = useVelociraptorHunts({
    page: huntPagination.page,
    limit: huntPagination.limit,
    search: debouncedHuntSearch || undefined,
    sortBy: huntSortBy,
    sortOrder: huntSortOrder,
  })

  useEffect(() => {
    if (endpointsData?.pagination) {
      endpointPagination.setTotal(endpointsData.pagination.total)
    }
  }, [endpointsData?.pagination, endpointPagination])

  useEffect(() => {
    if (huntsData?.pagination) {
      huntPagination.setTotal(huntsData.pagination.total)
    }
  }, [huntsData?.pagination, huntPagination])

  const syncMutation = useSyncVelociraptor()

  const handleSync = useCallback(() => {
    syncMutation.mutate(undefined, {
      onSuccess: result => {
        Toast.success(
          t('endpoints.syncSuccess', {
            endpoints: result.data?.endpoints ?? 0,
            hunts: result.data?.hunts ?? 0,
          })
        )
      },
      onError: err => {
        Toast.error(tErrors(getErrorKey(err)))
      },
    })
  }, [syncMutation, t, tErrors])

  const endpointColumns: Column<VelociraptorEndpoint>[] = [
    { key: 'hostname', label: t('endpoints.hostname'), sortable: true },
    { key: 'os', label: t('endpoints.os'), sortable: true },
    { key: 'ipAddress', label: t('endpoints.ip') },
    {
      key: 'labels',
      label: t('endpoints.labels'),
      render: value => {
        const labels = value as string[]
        if (labels.length === 0) return <span className="text-muted-foreground">—</span>
        return (
          <div className="flex flex-wrap gap-1">
            {labels.map(label => (
              <Badge key={label} variant="outline" className="text-xs">
                {label}
              </Badge>
            ))}
          </div>
        )
      },
    },
    {
      key: 'lastSeenAt',
      label: t('endpoints.lastSeen'),
      sortable: true,
      defaultSortOrder: SortOrder.DESC,
      render: value => <span className="text-xs">{formatDate(value as string)}</span>,
    },
  ]

  const huntColumns: Column<VelociraptorHunt>[] = [
    { key: 'huntId', label: t('endpoints.huntId') },
    { key: 'description', label: t('endpoints.huntDescription'), className: 'max-w-sm truncate' },
    {
      key: 'state',
      label: t('endpoints.state'),
      sortable: true,
      render: value => (
        <Badge variant={value === 'RUNNING' ? 'default' : 'secondary'}>
          {String(value ?? '—')}
        </Badge>
      ),
    },
    { key: 'totalClients', label: t('endpoints.totalClients'), sortable: true },
    { key: 'finishedClients', label: t('endpoints.finishedClients') },
    {
      key: 'createdAt',
      label: t('endpoints.createdAt'),
      sortable: true,
      defaultSortOrder: SortOrder.DESC,
      render: value => <span className="text-xs">{formatDate(value as string)}</span>,
    },
  ]

  // Show error banner if either query fails (connector unavailable/not configured)
  const connectorError = endpointsError ?? huntsError
  if (connectorError) {
    const errorKey = getErrorKey(connectorError)
    return (
      <div className="space-y-6">
        <PageHeader title={t('endpoints.title')} description={t('endpoints.description')} />
        <div className="bg-status-warning border-status-warning flex items-center gap-2 rounded-lg border p-4">
          <AlertCircle className="text-status-warning h-5 w-5 shrink-0" />
          <p className="text-status-warning text-sm font-medium">{tErrors(errorKey)}</p>
        </div>
      </div>
    )
  }

  if (endpointsLoading || huntsLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('endpoints.title')}
        description={t('endpoints.description')}
        action={{
          label: syncMutation.isPending ? t('endpoints.syncing') : t('endpoints.sync'),
          icon: (
            <RefreshCw className={syncMutation.isPending ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
          ),
          onClick: handleSync,
        }}
      />

      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'endpoints' | 'hunts')}>
        <TabsList>
          <TabsTrigger value="endpoints" className="cursor-pointer gap-1.5">
            <Monitor className="h-4 w-4" />
            {t('endpoints.endpointsTab')}
          </TabsTrigger>
          <TabsTrigger value="hunts" className="cursor-pointer gap-1.5">
            {t('endpoints.huntsTab')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4">
          <div className="relative w-full sm:w-64">
            <Search className="text-muted-foreground absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              value={endpointSearch}
              onChange={e => setEndpointSearch(e.target.value)}
              placeholder={t('endpoints.searchPlaceholder')}
              className="ps-9"
            />
          </div>

          {(endpointsData?.data?.length ?? 0) === 0 && !endpointsFetching ? (
            <EmptyState
              icon={<Monitor className="h-6 w-6" />}
              title={t('endpoints.noEndpoints')}
              description={t('endpoints.noEndpointsDescription')}
            />
          ) : (
            <>
              <DataTable
                columns={endpointColumns}
                data={endpointsData?.data ?? []}
                loading={endpointsFetching}
                sortBy={endpointSortBy}
                sortOrder={endpointSortOrder}
                onSort={(key, order) => {
                  endpointPagination.setPage(1)
                  setEndpointSortBy(key)
                  setEndpointSortOrder(order)
                }}
              />
              <Pagination
                page={endpointPagination.page}
                totalPages={endpointPagination.totalPages}
                onPageChange={endpointPagination.setPage}
                total={endpointPagination.total}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="hunts" className="space-y-4">
          <div className="relative w-full sm:w-64">
            <Search className="text-muted-foreground absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              value={huntSearch}
              onChange={e => setHuntSearch(e.target.value)}
              placeholder={t('endpoints.huntSearchPlaceholder')}
              className="ps-9"
            />
          </div>

          {(huntsData?.data?.length ?? 0) === 0 && !huntsFetching ? (
            <EmptyState
              icon={<Monitor className="h-6 w-6" />}
              title={t('endpoints.noHunts')}
              description={t('endpoints.noHuntsDescription')}
            />
          ) : (
            <>
              <DataTable
                columns={huntColumns}
                data={huntsData?.data ?? []}
                loading={huntsFetching}
                sortBy={huntSortBy}
                sortOrder={huntSortOrder}
                onSort={(key, order) => {
                  huntPagination.setPage(1)
                  setHuntSortBy(key)
                  setHuntSortOrder(order)
                }}
              />
              <Pagination
                page={huntPagination.page}
                totalPages={huntPagination.totalPages}
                onPageChange={huntPagination.setPage}
                total={huntPagination.total}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
