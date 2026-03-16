'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { getAttackPathColumns } from '@/components/attack-paths'
import { Toast } from '@/components/common'
import { SortOrder } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import type {
  AttackPath,
  AttackPathSearchParams,
  CreateAttackPathFormValues,
  EditAttackPathFormValues,
} from '@/types'
import { useAttackPathDeleteDialog } from './useAttackPathDeleteDialog'
import {
  useAttackPaths,
  useAttackPathStats,
  useCreateAttackPath,
  useUpdateAttackPath,
  useDeleteAttackPath,
} from './useAttackPaths'
import { useDebounce } from './useDebounce'
import { usePagination } from './usePagination'

const ALL_FILTER = '__all__'

export function useAttackPathsPage() {
  const t = useTranslations('attackPath')
  const tCommon = useTranslations('common')
  const tError = useTranslations('errors')

  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC)
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingPath, setEditingPath] = useState<AttackPath | null>(null)

  const pagination = usePagination({ initialPage: 1, initialLimit: 10 })
  const debouncedQuery = useDebounce(searchQuery, 400)

  const searchParams: AttackPathSearchParams = {
    page: pagination.page,
    limit: pagination.limit,
    sortBy,
    sortOrder,
  }

  if (debouncedQuery.length > 0) {
    searchParams.query = debouncedQuery
  }

  if (severityFilter.length > 0) {
    searchParams.severity = severityFilter
  }

  if (statusFilter.length > 0) {
    searchParams.status = statusFilter
  }

  const { data, isFetching } = useAttackPaths(searchParams)
  const { data: statsData } = useAttackPathStats()
  const createMutation = useCreateAttackPath()
  const updateMutation = useUpdateAttackPath()
  const deleteMutation = useDeleteAttackPath()
  const { confirmDelete } = useAttackPathDeleteDialog()

  useEffect(() => {
    if (data?.pagination) {
      pagination.setTotal(data.pagination.total)
    }
  }, [data?.pagination, pagination])

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value)
      pagination.setPage(1)
    },
    [pagination]
  )

  const handleSeverityChange = useCallback(
    (value: string) => {
      setSeverityFilter(value === ALL_FILTER ? '' : value)
      pagination.setPage(1)
    },
    [pagination]
  )

  const handleStatusChange = useCallback(
    (value: string) => {
      setStatusFilter(value === ALL_FILTER ? '' : value)
      pagination.setPage(1)
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

  const handleRowClick = useCallback((path: AttackPath) => {
    setSelectedPathId(prev => (prev === path.id ? null : path.id))
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedPathId(null)
  }, [])

  const handleCreate = useCallback(
    (formData: CreateAttackPathFormValues) => {
      const payload: Record<string, unknown> = {
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        stages: formData.stages,
        affectedAssets: formData.affectedAssets,
      }

      createMutation.mutate(payload, {
        onSuccess: () => {
          Toast.success(t('createSuccess'))
          setCreateDialogOpen(false)
        },
        onError: (error: unknown) => {
          Toast.error(tError(getErrorKey(error)))
        },
      })
    },
    [createMutation, t, tError]
  )

  const handleOpenEdit = useCallback((path: AttackPath) => {
    setEditingPath(path)
    setEditDialogOpen(true)
  }, [])

  const handleEdit = useCallback(
    (formData: EditAttackPathFormValues) => {
      if (!editingPath) {
        return
      }

      const payload: Record<string, unknown> = {
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        status: formData.status,
        stages: formData.stages,
        affectedAssets: formData.affectedAssets,
      }

      updateMutation.mutate(
        { id: editingPath.id, data: payload },
        {
          onSuccess: () => {
            Toast.success(t('updateSuccess'))
            setEditDialogOpen(false)
            setEditingPath(null)
          },
          onError: (error: unknown) => {
            Toast.error(tError(getErrorKey(error)))
          },
        }
      )
    },
    [editingPath, updateMutation, t, tError]
  )

  const handleDelete = useCallback(
    async (path: AttackPath) => {
      const confirmed = await confirmDelete(path.title)
      if (!confirmed) {
        return
      }

      deleteMutation.mutate(path.id, {
        onSuccess: () => {
          Toast.success(t('deleteSuccess'))
          if (selectedPathId === path.id) {
            setSelectedPathId(null)
          }
        },
        onError: (error: unknown) => {
          Toast.error(tError(getErrorKey(error)))
        },
      })
    },
    [confirmDelete, deleteMutation, t, tError, selectedPathId]
  )

  const editInitialValues: EditAttackPathFormValues | null = editingPath
    ? {
        title: editingPath.title,
        description: editingPath.description ?? '',
        severity: editingPath.severity,
        status: editingPath.status,
        stages: (editingPath.stages ?? []).map(s => ({
          name: s.name,
          mitreId: s.mitreId,
          description: s.description,
          assets: s.assets,
        })),
        affectedAssets: editingPath.affectedAssets ?? 0,
      }
    : null

  const columns = useMemo(() => getAttackPathColumns({ attackPath: t }), [t])

  return {
    t,
    tCommon,
    searchQuery,
    setSearchQuery: handleSearchChange,
    severityFilter: severityFilter.length > 0 ? severityFilter : ALL_FILTER,
    setSeverityFilter: handleSeverityChange,
    statusFilter: statusFilter.length > 0 ? statusFilter : ALL_FILTER,
    setStatusFilter: handleStatusChange,
    sortBy,
    sortOrder,
    handleSort,
    isFetching,
    data,
    stats: statsData?.data ?? null,
    pagination,
    columns,
    selectedPathId,
    handleRowClick,
    handleCloseDetail,
    createDialogOpen,
    setCreateDialogOpen,
    handleCreate,
    createLoading: createMutation.isPending,
    editDialogOpen,
    setEditDialogOpen,
    editingPath,
    editInitialValues,
    handleOpenEdit,
    handleEdit,
    editLoading: updateMutation.isPending,
    handleDelete,
  }
}
