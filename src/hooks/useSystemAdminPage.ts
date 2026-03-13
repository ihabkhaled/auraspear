import { useState, useCallback, useEffect } from 'react'
import { SortOrder } from '@/enums'
import { useServiceHealth, useAuditLogs } from './useAdmin'
import { useAppLogs } from './useAppLogs'
import { useDebounce } from './useDebounce'
import { usePagination } from './usePagination'

export function useSystemAdminPage() {
  const { data: healthData, isLoading: healthLoading, isError: healthError } = useServiceHealth()

  // Active tab
  const [activeTab, setActiveTab] = useState<'audit' | 'appLogs'>('audit')

  // ── Audit logs state ──
  const auditPagination = usePagination({ initialPage: 1, initialLimit: 10 })
  const [auditSortBy, setAuditSortBy] = useState('createdAt')
  const [auditSortOrder, setAuditSortOrder] = useState<SortOrder>(SortOrder.DESC)

  const { data: auditData, isLoading: auditLoading } = useAuditLogs({
    page: auditPagination.page,
    limit: auditPagination.limit,
    sortBy: auditSortBy,
    sortOrder: auditSortOrder,
  })

  useEffect(() => {
    if (auditData?.pagination) {
      auditPagination.setTotal(auditData.pagination.total)
    }
  }, [auditData?.pagination, auditPagination])

  const handleAuditSort = useCallback(
    (key: string, order: SortOrder) => {
      auditPagination.setPage(1)
      setAuditSortBy(key)
      setAuditSortOrder(order)
    },
    [auditPagination]
  )

  // ── App logs state ──
  const appLogPagination = usePagination({ initialPage: 1, initialLimit: 20 })
  const [appLogSortBy, setAppLogSortBy] = useState('createdAt')
  const [appLogSortOrder, setAppLogSortOrder] = useState<SortOrder>(SortOrder.DESC)
  const [appLogSearch, setAppLogSearch] = useState('')
  const [appLogLevel, setAppLogLevel] = useState('')
  const [appLogFeature, setAppLogFeature] = useState('')
  const [appLogActorEmail, setAppLogActorEmail] = useState('')
  const debouncedAppLogSearch = useDebounce(appLogSearch, 400)

  const { data: appLogData, isFetching: appLogFetching } = useAppLogs({
    page: appLogPagination.page,
    limit: appLogPagination.limit,
    sortBy: appLogSortBy,
    sortOrder: appLogSortOrder,
    query: debouncedAppLogSearch || undefined,
    level: appLogLevel || undefined,
    feature: appLogFeature || undefined,
    actorEmail: appLogActorEmail || undefined,
  })

  useEffect(() => {
    if (appLogData?.pagination) {
      appLogPagination.setTotal(appLogData.pagination.total)
    }
  }, [appLogData?.pagination, appLogPagination])

  // Reset page on filter change
  useEffect(() => {
    appLogPagination.setPage(1)
  }, [debouncedAppLogSearch, appLogLevel, appLogFeature, appLogActorEmail, appLogPagination])

  const handleAppLogSort = useCallback(
    (key: string, order: SortOrder) => {
      appLogPagination.setPage(1)
      setAppLogSortBy(key)
      setAppLogSortOrder(order)
    },
    [appLogPagination]
  )

  const resetAppLogFilters = useCallback(() => {
    setAppLogSearch('')
    setAppLogLevel('')
    setAppLogFeature('')
    setAppLogActorEmail('')
    appLogPagination.setPage(1)
  }, [appLogPagination])

  return {
    // Tab
    activeTab,
    setActiveTab,

    // Health
    healthData,
    healthLoading,
    healthError,

    // Audit logs
    auditData,
    auditLoading,
    pagination: auditPagination,
    auditSortBy,
    auditSortOrder,
    handleAuditSort,

    // App logs
    appLogData,
    appLogFetching,
    appLogPagination,
    appLogSortBy,
    appLogSortOrder,
    handleAppLogSort,
    appLogSearch,
    setAppLogSearch,
    appLogLevel,
    setAppLogLevel,
    appLogFeature,
    setAppLogFeature,
    appLogActorEmail,
    setAppLogActorEmail,
    resetAppLogFilters,
  }
}
