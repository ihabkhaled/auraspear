'use client'

import { useMemo, useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { SweetAlertDialog, SweetAlertIcon, Toast } from '@/components/common'
import { getNormalizationColumns } from '@/components/normalization/NormalizationTableColumns'
import { NormalizationSourceType, Permission, SortOrder } from '@/enums'
import { ALL_FILTER } from '@/lib/constants/filters'
import { hasPermission } from '@/lib/permissions'
import { safeJsonParse } from '@/lib/utils'
import { useAuthStore } from '@/stores'
import type {
  CreateNormalizationFormValues,
  EditNormalizationFormValues,
  NormalizationPipeline,
  NormalizationSearchParams,
} from '@/types'
import { useDebounce } from './useDebounce'
import {
  useNormalizationPipelines,
  useNormalizationStats,
  useCreatePipeline,
  useUpdatePipeline,
  useDeletePipeline,
} from './useNormalization'
import { usePagination } from './usePagination'

export function useNormalizationPage() {
  const t = useTranslations('normalization')
  const tCommon = useTranslations('common')
  const permissions = useAuthStore(s => s.permissions)

  const canCreate = hasPermission(permissions, Permission.NORMALIZATION_CREATE)
  const canEdit = hasPermission(permissions, Permission.NORMALIZATION_UPDATE)
  const canDelete = hasPermission(permissions, Permission.NORMALIZATION_DELETE)

  const [searchQuery, setSearchQuery] = useState('')
  const [sourceTypeFilter, setSourceTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC)

  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedPipeline, setSelectedPipeline] = useState<NormalizationPipeline | null>(null)

  const pagination = usePagination({ initialPage: 1, initialLimit: 10 })
  const debouncedSearch = useDebounce(searchQuery, 400)

  const searchParams: NormalizationSearchParams = {
    page: pagination.page,
    limit: pagination.limit,
    sortBy,
    sortOrder,
  }

  if (debouncedSearch.length > 0) {
    searchParams.query = debouncedSearch
  }
  if (sourceTypeFilter.length > 0) {
    searchParams.sourceType = sourceTypeFilter
  }
  if (statusFilter.length > 0) {
    searchParams.status = statusFilter
  }

  const { data, isFetching } = useNormalizationPipelines(searchParams)
  const { data: statsData, isLoading: statsLoading } = useNormalizationStats()
  const createMutation = useCreatePipeline()
  const updateMutation = useUpdatePipeline()
  const deleteMutation = useDeletePipeline()

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

  const handleSourceTypeChange = useCallback(
    (value: string) => {
      pagination.setPage(1)
      setSourceTypeFilter(value === ALL_FILTER ? '' : value)
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
    (formData: CreateNormalizationFormValues) => {
      const payload: Record<string, unknown> = {
        name: formData.name,
        sourceType: formData.sourceType,
        parserConfig: safeJsonParse(formData.parserConfig, {}),
        fieldMappings: safeJsonParse(formData.fieldMappings, {}),
      }
      createMutation.mutate(payload, {
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
    (formData: EditNormalizationFormValues) => {
      if (!selectedPipeline) return
      const payload: Record<string, unknown> = {
        name: formData.name,
        sourceType: formData.sourceType,
        parserConfig: safeJsonParse(formData.parserConfig, {}),
        fieldMappings: safeJsonParse(formData.fieldMappings, {}),
      }
      updateMutation.mutate(
        { id: selectedPipeline.id, data: payload },
        {
          onSuccess: () => {
            Toast.success(t('editSuccess'))
            setEditOpen(false)
            setSelectedPipeline(null)
          },
          onError: () => {
            Toast.error(t('editError'))
          },
        }
      )
    },
    [updateMutation, selectedPipeline, t]
  )

  const handleDelete = useCallback(
    async (id: string, name?: string) => {
      const confirmed = await SweetAlertDialog.show({
        text: t('confirmDeletePipeline', { name: name ?? '' }),
        icon: SweetAlertIcon.WARNING,
        confirmButtonText: tCommon('delete'),
        cancelButtonText: tCommon('cancel'),
      })
      if (!confirmed) return
      deleteMutation.mutate(id, {
        onSuccess: () => {
          Toast.success(t('deleteSuccess'))
        },
        onError: () => {
          Toast.error(t('deleteError'))
        },
      })
    },
    [deleteMutation, t, tCommon]
  )

  const handleRowClick = useCallback((pipeline: NormalizationPipeline) => {
    setSelectedPipeline(pipeline)
    setDetailOpen(true)
  }, [])

  const handleOpenEdit = useCallback((pipeline: NormalizationPipeline) => {
    setSelectedPipeline(pipeline)
    setDetailOpen(false)
    setEditOpen(true)
  }, [])

  const handleOpenDelete = useCallback(
    (pipeline: NormalizationPipeline) => {
      setDetailOpen(false)
      void handleDelete(pipeline.id, pipeline.name)
    },
    [handleDelete]
  )

  const columns = useMemo(
    () => getNormalizationColumns({ normalization: t, common: tCommon }),
    [t, tCommon]
  )

  const stats = statsData?.data

  const editInitialValues = useMemo(
    () => ({
      name: selectedPipeline?.name ?? '',
      sourceType: selectedPipeline?.sourceType ?? NormalizationSourceType.SYSLOG,
      parserConfig: selectedPipeline
        ? JSON.stringify(selectedPipeline.parserConfig, null, 2)
        : '{}',
      fieldMappings: selectedPipeline
        ? JSON.stringify(selectedPipeline.fieldMappings, null, 2)
        : '{}',
    }),
    [selectedPipeline]
  )

  return {
    t,
    tCommon,
    data,
    stats,
    statsLoading,
    columns,
    isFetching,
    pagination,
    searchQuery,
    sourceTypeFilter: sourceTypeFilter.length > 0 ? sourceTypeFilter : ALL_FILTER,
    statusFilter: statusFilter.length > 0 ? statusFilter : ALL_FILTER,
    sortBy,
    sortOrder,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    detailOpen,
    setDetailOpen,
    selectedPipeline,
    createLoading: createMutation.isPending,
    editInitialValues,
    editLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
    handleSearchChange,
    handleSourceTypeChange,
    handleStatusChange,
    handleSort,
    handleCreate,
    handleEdit,
    handleDelete,
    handleRowClick,
    handleOpenEdit,
    handleOpenDelete,
    canCreate,
    canEdit,
    canDelete,
  }
}
