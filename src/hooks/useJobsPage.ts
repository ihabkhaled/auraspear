'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { Permission } from '@/enums'
import type { JobStatus, JobType } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { ALL_JOB_FILTER_VALUE } from '@/lib/constants/jobs'
import { isJobStatus, isJobType } from '@/lib/job.utils'
import { hasPermission } from '@/lib/permissions'
import { useAuthStore } from '@/stores'
import { useCancelJob, useJobs, useJobStats, useRetryJob } from './useJobs'
import { usePagination } from './usePagination'

export function useJobsPage() {
  const t = useTranslations('jobs')
  const tErrors = useTranslations('errors')
  const permissions = useAuthStore(s => s.permissions)

  const [statusFilter, setStatusFilter] = useState<JobStatus | undefined>()
  const [typeFilter, setTypeFilter] = useState<JobType | undefined>()
  const pagination = usePagination({ initialPage: 1, initialLimit: 20 })

  const canManage = hasPermission(permissions, Permission.JOBS_MANAGE)

  const params = useMemo(
    () => ({
      page: pagination.page,
      limit: pagination.limit,
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(typeFilter ? { type: typeFilter } : {}),
    }),
    [pagination.limit, pagination.page, statusFilter, typeFilter]
  )

  const { data, isLoading, isFetching } = useJobs(params)
  const { data: stats } = useJobStats()
  const retryMutation = useRetryJob()
  const cancelMutation = useCancelJob()

  useEffect(() => {
    const paginationData = data?.pagination ?? data
    const total = (paginationData as Record<string, unknown> | undefined)?.['total']
    if (typeof total === 'number') {
      pagination.setTotal(total)
    }
  }, [data, pagination])

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
    allFilterValue: ALL_JOB_FILTER_VALUE,
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
  }
}
