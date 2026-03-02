import { useState, useCallback, useEffect } from 'react'
import { SortOrder } from '@/enums'
import { useServiceHealth, useAuditLogs } from './useAdmin'
import { usePagination } from './usePagination'

export function useSystemAdminPage() {
  const { data: healthData, isLoading: healthLoading, isError: healthError } = useServiceHealth()
  const pagination = usePagination({ initialPage: 1, initialLimit: 10 })
  const [auditSortBy, setAuditSortBy] = useState('createdAt')
  const [auditSortOrder, setAuditSortOrder] = useState<SortOrder>(SortOrder.DESC)

  const { data: auditData, isLoading: auditLoading } = useAuditLogs({
    page: pagination.page,
    limit: pagination.limit,
    sortBy: auditSortBy,
    sortOrder: auditSortOrder,
  })

  useEffect(() => {
    if (auditData?.pagination) {
      pagination.setTotal(auditData.pagination.total)
    }
  }, [auditData?.pagination, pagination])

  const handleAuditSort = useCallback(
    (key: string, order: SortOrder) => {
      pagination.setPage(1)
      setAuditSortBy(key)
      setAuditSortOrder(order)
    },
    [pagination]
  )

  return {
    healthData,
    healthLoading,
    healthError,
    auditData,
    auditLoading,
    pagination,
    auditSortBy,
    auditSortOrder,
    handleAuditSort,
  }
}
