'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { getSystemHealthColumns } from '@/components/system-health/SystemHealthTableColumns'
import { SortOrder } from '@/enums'
import type {
  CreateHealthCheckFormValues,
  EditHealthCheckFormValues,
  HealthCheckSearchParams,
  SystemHealthCheck,
  SystemMetric,
} from '@/types'
import { usePagination } from './usePagination'
import {
  useHealthChecks,
  useLatestHealthChecks,
  useSystemHealthStats,
  useCreateHealthCheck,
  useUpdateHealthCheck,
  useDeleteHealthCheck,
  useSystemMetrics,
} from './useSystemHealth'

const ALL_FILTER = '__all__'

export function useSystemHealthPage() {
  const t = useTranslations('systemHealth')
  const tCommon = useTranslations('common')

  const [serviceTypeFilter, setServiceTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('checkedAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC)

  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedCheck, setSelectedCheck] = useState<SystemHealthCheck | null>(null)
  const [detailMetrics, setDetailMetrics] = useState<SystemMetric[]>([])

  const pagination = usePagination({ initialPage: 1, initialLimit: 10 })

  const searchParams: HealthCheckSearchParams = {
    page: pagination.page,
    limit: pagination.limit,
    sortBy,
    sortOrder,
  }

  if (serviceTypeFilter.length > 0) {
    searchParams.serviceType = serviceTypeFilter
  }
  if (statusFilter.length > 0) {
    searchParams.status = statusFilter
  }

  const { data, isFetching } = useHealthChecks(searchParams)
  const { data: latestData } = useLatestHealthChecks()
  const { data: statsData, isLoading: statsLoading } = useSystemHealthStats()
  const { data: metricsData } = useSystemMetrics()
  const createMutation = useCreateHealthCheck()
  const updateMutation = useUpdateHealthCheck()
  const deleteMutation = useDeleteHealthCheck()

  useEffect(() => {
    if (data?.pagination) {
      pagination.setTotal(data.pagination.total)
    }
  }, [data?.pagination, pagination])

  const handleServiceTypeChange = useCallback(
    (value: string) => {
      pagination.setPage(1)
      setServiceTypeFilter(value === ALL_FILTER ? '' : value)
    },
    [pagination]
  )

  const handleStatusChange = useCallback(
    (value: string) => {
      pagination.setPage(1)
      setStatusFilter(value === ALL_FILTER ? '' : value)
    },
    [pagination]
  )

  const handleSort = useCallback(
    (key: string, order: SortOrder) => {
      pagination.setPage(1)
      setSortBy(key)
      setSortOrder(order)
    },
    [pagination]
  )

  const handleCreate = useCallback(
    (formData: CreateHealthCheckFormValues) => {
      createMutation.mutate(formData as unknown as Record<string, unknown>, {
        onSuccess: () => {
          Toast.success(t('createSuccess'))
          setCreateOpen(false)
        },
        onError: () => {
          Toast.error(t('createError'))
        },
      })
    },
    [createMutation, t]
  )

  const handleEdit = useCallback(
    (formData: EditHealthCheckFormValues) => {
      if (!selectedCheck) return
      updateMutation.mutate(
        { id: selectedCheck.id, data: formData as unknown as Record<string, unknown> },
        {
          onSuccess: () => {
            Toast.success(t('editSuccess'))
            setEditOpen(false)
            setSelectedCheck(null)
          },
          onError: () => {
            Toast.error(t('editError'))
          },
        }
      )
    },
    [updateMutation, selectedCheck, t]
  )

  const handleDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          Toast.success(t('deleteSuccess'))
        },
        onError: () => {
          Toast.error(t('deleteError'))
        },
      })
    },
    [deleteMutation, t]
  )

  const handleOpenDetail = useCallback(
    (check: SystemHealthCheck) => {
      setSelectedCheck(check)
      const checkMetrics =
        metricsData?.data?.filter((m: SystemMetric) => m.serviceType === check.serviceType) ?? []
      setDetailMetrics(checkMetrics)
      setDetailOpen(true)
    },
    [metricsData]
  )

  const handleOpenEdit = useCallback((check: SystemHealthCheck) => {
    setSelectedCheck(check)
    setEditOpen(true)
  }, [])

  const columns = useMemo(
    () => getSystemHealthColumns({ systemHealth: t, common: tCommon }),
    [t, tCommon]
  )

  const stats = statsData?.data
  const latestChecks = latestData?.data ?? []

  return {
    t,
    tCommon,
    data,
    stats,
    statsLoading,
    latestChecks,
    columns,
    isFetching,
    pagination,
    serviceTypeFilter: serviceTypeFilter.length > 0 ? serviceTypeFilter : ALL_FILTER,
    statusFilter: statusFilter.length > 0 ? statusFilter : ALL_FILTER,
    sortBy,
    sortOrder,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    detailOpen,
    setDetailOpen,
    selectedCheck,
    detailMetrics,
    createLoading: createMutation.isPending,
    editLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
    handleServiceTypeChange,
    handleStatusChange,
    handleSort,
    handleCreate,
    handleEdit,
    handleDelete,
    handleOpenDetail,
    handleOpenEdit,
  }
}
