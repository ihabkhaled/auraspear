'use client'

import { useState, useCallback, useMemo } from 'react'
import { BarChart3, Play, Search, AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  PageHeader,
  LoadingSpinner,
  EmptyState,
  Pagination,
  DataTable,
  Toast,
} from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SortOrder } from '@/enums'
import { useInfluxDBBuckets, useInfluxDBQuery } from '@/hooks'
import { getErrorKey } from '@/lib/api-error'
import { parseFluxCSV, formatTimestamp } from '@/lib/utils'
import type { Column } from '@/types'

const TIME_RANGES = [
  { value: '-15m', label: '15m' },
  { value: '-1h', label: '1h' },
  { value: '-6h', label: '6h' },
  { value: '-24h', label: '24h' },
  { value: '-7d', label: '7d' },
]

const ROWS_PER_PAGE = 20

export default function ExplorerMetricsPage() {
  const t = useTranslations('explorer')
  const tErrors = useTranslations()

  const [bucket, setBucket] = useState('')
  const [measurement, setMeasurement] = useState('')
  const [range, setRange] = useState('-1h')
  const [limit, setLimit] = useState(1000)
  const [queryEnabled, setQueryEnabled] = useState(false)

  // Table state
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<string | undefined>()
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC)
  const [currentPage, setCurrentPage] = useState(1)

  const { data: bucketsData, isLoading: bucketsLoading, error: bucketsError } = useInfluxDBBuckets()
  const {
    data: queryData,
    isFetching: queryFetching,
    error: queryError,
  } = useInfluxDBQuery(
    { bucket, measurement: measurement || undefined, range, limit },
    queryEnabled && bucket.length > 0
  )

  const handleQuery = useCallback(() => {
    if (!bucket) {
      Toast.warning(t('metrics.selectBucket'))
      return
    }
    setCurrentPage(1)
    setSearch('')
    setSortBy(undefined)
    setQueryEnabled(true)
  }, [bucket, t])

  // Parse CSV data into rows/columns
  const parsed = useMemo(() => {
    const csvData = queryData?.data?.data
    if (!csvData || csvData.trim().length === 0) return { columns: [], rows: [] }
    return parseFluxCSV(csvData)
  }, [queryData])

  // Filter rows by search
  const filteredRows = useMemo(() => {
    if (!search) return parsed.rows
    const lowerSearch = search.toLowerCase()
    return parsed.rows.filter(row =>
      Object.values(row).some(v => v.toLowerCase().includes(lowerSearch))
    )
  }, [parsed.rows, search])

  // Sort rows
  const sortedRows = useMemo(() => {
    if (!sortBy) return filteredRows
    const sorted = [...filteredRows]
    sorted.sort((a, b) => {
      const aVal = a[sortBy] ?? ''
      const bVal = b[sortBy] ?? ''
      // Try numeric comparison first
      const aNum = Number(aVal)
      const bNum = Number(bVal)
      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
        return sortOrder === SortOrder.ASC ? aNum - bNum : bNum - aNum
      }
      const cmp = aVal.localeCompare(bVal)
      return sortOrder === SortOrder.ASC ? cmp : -cmp
    })
    return sorted
  }, [filteredRows, sortBy, sortOrder])

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / ROWS_PER_PAGE))
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE
    return sortedRows.slice(start, start + ROWS_PER_PAGE)
  }, [sortedRows, currentPage])

  // Build dynamic columns from parsed headers
  const columns: Column<Record<string, string>>[] = useMemo(
    () =>
      parsed.columns.map(col => ({
        key: col,
        label: col.startsWith('_') ? col.slice(1) : col,
        sortable: true,
        render: value => {
          const strVal = String(value ?? '')
          // Format timestamps
          if (col === '_time' || col === '_start' || col === '_stop') {
            return <span className="text-xs">{formatTimestamp(strVal)}</span>
          }
          return <span className="text-xs">{strVal}</span>
        },
      })),
    [parsed.columns]
  )

  const handleSort = useCallback((key: string, order: SortOrder) => {
    setSortBy(key)
    setSortOrder(order)
    setCurrentPage(1)
  }, [])

  // Error state for buckets (connector not configured / unavailable)
  if (bucketsError) {
    const errorKey = getErrorKey(bucketsError)
    return (
      <div className="space-y-6">
        <PageHeader title={t('metrics.title')} description={t('metrics.description')} />
        <div className="bg-status-warning border-status-warning flex items-center gap-2 rounded-lg border p-4">
          <AlertCircle className="text-status-warning h-5 w-5 shrink-0" />
          <p className="text-status-warning text-sm font-medium">{tErrors(errorKey)}</p>
        </div>
      </div>
    )
  }

  if (bucketsLoading) return <LoadingSpinner />

  const buckets = (bucketsData?.data ?? []) as Array<{ name: string }>

  return (
    <div className="space-y-6">
      <PageHeader title={t('metrics.title')} description={t('metrics.description')} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('metrics.queryBuilder')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-2">
              <Label>{t('metrics.bucket')}</Label>
              <Select
                value={bucket}
                onValueChange={v => {
                  setBucket(v)
                  setQueryEnabled(false)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('metrics.selectBucket')} />
                </SelectTrigger>
                <SelectContent>
                  {buckets.map(b => (
                    <SelectItem key={b.name} value={b.name}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('metrics.measurement')}</Label>
              <Input
                value={measurement}
                onChange={e => {
                  setMeasurement(e.target.value)
                  setQueryEnabled(false)
                }}
                placeholder={t('metrics.measurementPlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('metrics.timeRange')}</Label>
              <Select
                value={range}
                onValueChange={v => {
                  setRange(v)
                  setQueryEnabled(false)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_RANGES.map(r => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('metrics.limit')}</Label>
              <Input
                type="number"
                value={limit}
                onChange={e => {
                  setLimit(Number(e.target.value) || 100)
                  setQueryEnabled(false)
                }}
                min={1}
                max={10000}
              />
            </div>
          </div>

          <div className="mt-4">
            <Button onClick={handleQuery} disabled={queryFetching || !bucket}>
              <Play className="me-2 h-4 w-4" />
              {queryFetching ? t('metrics.querying') : t('metrics.runQuery')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {queryError && (
        <div className="bg-status-error border-status-error flex items-center gap-2 rounded-lg border p-4">
          <AlertCircle className="text-status-error h-5 w-5 shrink-0" />
          <p className="text-status-error text-sm font-medium">
            {tErrors(getErrorKey(queryError))}
          </p>
        </div>
      )}

      {queryData?.data && (
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-base">
                {t('metrics.results')}
                {sortedRows.length > 0 && (
                  <span className="text-muted-foreground ms-2 text-sm font-normal">
                    {t('metrics.totalRows', { count: filteredRows.length })}
                  </span>
                )}
              </CardTitle>
              {parsed.rows.length > 0 && (
                <div className="relative w-full sm:w-64">
                  <Search className="text-muted-foreground absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <Input
                    value={search}
                    onChange={e => {
                      setSearch(e.target.value)
                      setCurrentPage(1)
                    }}
                    placeholder={t('metrics.searchPlaceholder')}
                    className="ps-9"
                  />
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {parsed.rows.length === 0 ? (
              <EmptyState
                icon={<BarChart3 className="h-6 w-6" />}
                title={t('metrics.noData')}
                description={t('metrics.noDataDescription')}
              />
            ) : (
              <div className="space-y-4">
                <DataTable
                  columns={columns}
                  data={paginatedRows}
                  loading={queryFetching}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <Pagination
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  total={filteredRows.length}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
