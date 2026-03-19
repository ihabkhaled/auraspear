'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { Permission } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { hasPermission } from '@/lib/permissions'
import { useAuthStore } from '@/stores'
import { useCancelJob, useJobs, useJobStats, useRetryJob } from './useJobs'
import { usePagination } from './usePagination'

export function useJobsPage() {
  const t = useTranslations('jobs')
  const tErrors = useTranslations('errors')
  const permissions = useAuthStore(s => s.permissions)

  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const pagination = usePagination({ initialPage: 1, initialLimit: 20 })

  const canManage = hasPermission(permissions, Permission.JOBS_MANAGE)

  const params = useMemo(
    () => ({
      page: pagination.page,
      limit: pagination.limit,
      ...(statusFilter ? { status: statusFilter as never } : {}),
      ...(typeFilter ? { type: typeFilter as never } : {}),
    }),
    [pagination.limit, pagination.page, statusFilter, typeFilter]
  )

  const { data, isLoading, isFetching } = useJobs(params)
  const { data: stats } = useJobStats()
  const retryMutation = useRetryJob()
  const cancelMutation = useCancelJob()

  useEffect(() => {
    if (data?.pagination) {
      pagination.setTotal(data.pagination.total)
    }
  }, [data?.pagination, pagination])

  const handleRetry = useCallback(
    (id: string) => {
      retryMutation.mutate(id, {
        onSuccess: () => {
          Toast.success(t('retrySuccess'))
        },
        onError: (error: unknown) => {
          Toast.error(tErrors(getErrorKey(error)))
        },
      })
    },
    [retryMutation, t, tErrors]
  )

  const handleCancel = useCallback(
    (id: string) => {
      cancelMutation.mutate(id, {
        onSuccess: () => {
          Toast.success(t('cancelSuccess'))
        },
        onError: (error: unknown) => {
          Toast.error(tErrors(getErrorKey(error)))
        },
      })
    },
    [cancelMutation, t, tErrors]
  )

  const isMutating = retryMutation.isPending || cancelMutation.isPending

  return {
    t,
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
  }
}
