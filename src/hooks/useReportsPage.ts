'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { getReportColumns } from '@/components/reports'
import { ReportFormat, ReportType, SortOrder } from '@/enums'
import type {
  Report,
  ReportSearchParams,
  CreateReportFormValues,
  EditReportFormValues,
} from '@/types'
import { useDebounce } from './useDebounce'
import { usePagination } from './usePagination'
import {
  useReports,
  useReportStats,
  useCreateReport,
  useUpdateReport,
  useDeleteReport,
} from './useReports'

const ALL_FILTER = '__all__'

export function useReportsPage() {
  const t = useTranslations('reports')
  const tCommon = useTranslations('common')

  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [formatFilter, setFormatFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC)

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [deleteReportId, setDeleteReportId] = useState<string | null>(null)
  const [deleteReportName, setDeleteReportName] = useState('')

  const pagination = usePagination({ initialPage: 1, initialLimit: 10 })
  const debouncedSearch = useDebounce(searchQuery, 400)

  const searchParams: ReportSearchParams = {
    page: pagination.page,
    limit: pagination.limit,
    sortBy,
    sortOrder,
  }

  if (debouncedSearch.length > 0) {
    searchParams.query = debouncedSearch
  }
  if (typeFilter.length > 0) {
    searchParams.type = typeFilter
  }
  if (formatFilter.length > 0) {
    searchParams.format = formatFilter
  }
  if (statusFilter.length > 0) {
    searchParams.status = statusFilter
  }

  const { data, isFetching, isLoading } = useReports(searchParams)
  const { data: statsData } = useReportStats()
  const createMutation = useCreateReport()
  const updateMutation = useUpdateReport()
  const deleteMutation = useDeleteReport()

  useEffect(() => {
    if (data?.pagination) {
      pagination.setTotal(data.pagination.total)
    }
  }, [data?.pagination, pagination])

  const handleSearchChange = useCallback(
    (value: string) => {
      pagination.setPage(1)
      setSearchQuery(value)
    },
    [pagination]
  )

  const handleTypeChange = useCallback(
    (value: string) => {
      pagination.setPage(1)
      setTypeFilter(value === ALL_FILTER ? '' : value)
    },
    [pagination]
  )

  const handleFormatChange = useCallback(
    (value: string) => {
      pagination.setPage(1)
      setFormatFilter(value === ALL_FILTER ? '' : value)
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

  const handleRowClick = useCallback((report: Report) => {
    setSelectedReport(report)
    setDetailOpen(true)
  }, [])

  const handleCreate = useCallback(
    (formData: CreateReportFormValues) => {
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
    (formData: EditReportFormValues) => {
      if (!selectedReport) {
        return
      }
      updateMutation.mutate(
        { id: selectedReport.id, data: formData as unknown as Record<string, unknown> },
        {
          onSuccess: () => {
            Toast.success(t('updateSuccess'))
            setEditOpen(false)
          },
          onError: () => {
            Toast.error(t('updateError'))
          },
        }
      )
    },
    [updateMutation, selectedReport, t]
  )

  const handleDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          Toast.success(t('deleteSuccess'))
          setDeleteReportId(null)
        },
        onError: () => {
          Toast.error(t('deleteError'))
        },
      })
    },
    [deleteMutation, t]
  )

  const openEditDialog = useCallback((report: Report) => {
    setSelectedReport(report)
    setEditOpen(true)
  }, [])

  const openDeleteDialog = useCallback((report: Report) => {
    setDeleteReportId(report.id)
    setDeleteReportName(report.name)
  }, [])

  const editInitialValues: EditReportFormValues = useMemo(
    () => ({
      name: selectedReport?.name ?? '',
      description: selectedReport?.description ?? '',
      type: selectedReport?.type ?? ReportType.EXECUTIVE,
      format: selectedReport?.format ?? ReportFormat.PDF,
      scheduled: false,
      cronExpression: '',
    }),
    [selectedReport]
  )

  const columns = useMemo(() => getReportColumns({ reports: t, common: tCommon }), [t, tCommon])

  const stats = statsData?.data

  return {
    t,
    tCommon,
    data,
    stats,
    columns,
    isLoading,
    isFetching,
    pagination,
    searchQuery,
    typeFilter: typeFilter.length > 0 ? typeFilter : ALL_FILTER,
    formatFilter: formatFilter.length > 0 ? formatFilter : ALL_FILTER,
    statusFilter: statusFilter.length > 0 ? statusFilter : ALL_FILTER,
    sortBy,
    sortOrder,
    handleSearchChange,
    handleTypeChange,
    handleFormatChange,
    handleStatusChange,
    handleSort,
    handleRowClick,
    // CRUD
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    detailOpen,
    setDetailOpen,
    selectedReport,
    deleteReportId,
    deleteReportName,
    editInitialValues,
    handleCreate,
    handleEdit,
    handleDelete,
    openEditDialog,
    openDeleteDialog,
    createLoading: createMutation.isPending,
    editLoading: updateMutation.isPending,
  }
}
