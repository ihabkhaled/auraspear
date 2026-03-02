import { useEffect } from 'react'
import { useServiceHealth, useAuditLogs } from './useAdmin'
import { usePagination } from './usePagination'

export function useSystemAdminPage() {
  const { data: healthData, isLoading: healthLoading, isError: healthError } = useServiceHealth()
  const pagination = usePagination({ initialPage: 1, initialLimit: 10 })

  const { data: auditData, isLoading: auditLoading } = useAuditLogs({
    page: pagination.page,
    limit: pagination.limit,
  })

  useEffect(() => {
    if (auditData?.pagination) {
      pagination.setTotal(auditData.pagination.total)
    }
  }, [auditData?.pagination, pagination])

  return {
    healthData,
    healthLoading,
    healthError,
    auditData,
    auditLoading,
    pagination,
  }
}
