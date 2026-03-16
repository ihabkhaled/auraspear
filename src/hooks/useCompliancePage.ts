'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { getComplianceColumns } from '@/components/compliance'
import { ComplianceStandard, SortOrder } from '@/enums'
import type {
  ComplianceFramework,
  ComplianceSearchParams,
  CreateComplianceFrameworkFormValues,
  EditComplianceFrameworkFormValues,
} from '@/types'
import {
  useComplianceFrameworks,
  useComplianceStats,
  useCreateFramework,
  useUpdateFramework,
  useDeleteFramework,
} from './useCompliance'
import { useDebounce } from './useDebounce'
import { usePagination } from './usePagination'

const ALL_FILTER = '__all__'

export function useCompliancePage() {
  const t = useTranslations('compliance')
  const tCommon = useTranslations('common')

  const [searchQuery, setSearchQuery] = useState('')
  const [standardFilter, setStandardFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC)

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedFramework, setSelectedFramework] = useState<ComplianceFramework | null>(null)
  const [deleteFrameworkId, setDeleteFrameworkId] = useState<string | null>(null)
  const [deleteFrameworkName, setDeleteFrameworkName] = useState('')

  const pagination = usePagination({ initialPage: 1, initialLimit: 10 })
  const debouncedSearch = useDebounce(searchQuery, 400)

  const searchParams: ComplianceSearchParams = {
    page: pagination.page,
    limit: pagination.limit,
    sortBy,
    sortOrder,
  }

  if (debouncedSearch.length > 0) {
    searchParams.query = debouncedSearch
  }
  if (standardFilter.length > 0) {
    searchParams.standard = standardFilter
  }

  const { data, isFetching, isLoading } = useComplianceFrameworks(searchParams)
  const { data: statsData } = useComplianceStats()
  const createMutation = useCreateFramework()
  const updateMutation = useUpdateFramework()
  const deleteMutation = useDeleteFramework()

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

  const handleStandardChange = useCallback(
    (value: string) => {
      pagination.setPage(1)
      setStandardFilter(value === ALL_FILTER ? '' : value)
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

  const handleRowClick = useCallback((framework: ComplianceFramework) => {
    setSelectedFramework(framework)
    setDetailOpen(true)
  }, [])

  const handleCreate = useCallback(
    (formData: CreateComplianceFrameworkFormValues) => {
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
    (formData: EditComplianceFrameworkFormValues) => {
      if (!selectedFramework) {
        return
      }
      updateMutation.mutate(
        { id: selectedFramework.id, data: formData as unknown as Record<string, unknown> },
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
    [updateMutation, selectedFramework, t]
  )

  const handleDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          Toast.success(t('deleteSuccess'))
          setDeleteFrameworkId(null)
        },
        onError: () => {
          Toast.error(t('deleteError'))
        },
      })
    },
    [deleteMutation, t]
  )

  const openEditDialog = useCallback((framework: ComplianceFramework) => {
    setSelectedFramework(framework)
    setDetailOpen(false)
    setEditOpen(true)
  }, [])

  const openDeleteDialog = useCallback((framework: ComplianceFramework) => {
    setDetailOpen(false)
    setDeleteFrameworkId(framework.id)
    setDeleteFrameworkName(framework.name)
  }, [])

  const editInitialValues: EditComplianceFrameworkFormValues = useMemo(
    () => ({
      name: selectedFramework?.name ?? '',
      standard: selectedFramework?.standard ?? ComplianceStandard.ISO_27001,
      version: selectedFramework?.version ?? '',
      description: selectedFramework?.description ?? '',
    }),
    [selectedFramework]
  )

  const columns = useMemo(
    () => getComplianceColumns({ compliance: t, common: tCommon }),
    [t, tCommon]
  )

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
    standardFilter: standardFilter.length > 0 ? standardFilter : ALL_FILTER,
    sortBy,
    sortOrder,
    handleSearchChange,
    handleStandardChange,
    handleSort,
    handleRowClick,
    // CRUD
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    detailOpen,
    setDetailOpen,
    selectedFramework,
    deleteFrameworkId,
    deleteFrameworkName,
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
