'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { getUebaColumns } from '@/components/ueba'
import { UebaEntityType } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import type {
  UebaEntity,
  UebaEntitySearchParams,
  CreateUebaEntityFormValues,
  EditUebaEntityFormValues,
} from '@/types'
import { useDebounce } from './useDebounce'
import { usePagination } from './usePagination'
import {
  useUebaEntities,
  useUebaStats,
  useCreateUebaEntity,
  useUpdateUebaEntity,
  useDeleteUebaEntity,
} from './useUeba'

const ALL_FILTER = '__all__'

export function useUebaPage() {
  const t = useTranslations('ueba')
  const tCommon = useTranslations('common')

  const [searchQuery, setSearchQuery] = useState('')
  const [entityTypeFilter, setEntityTypeFilter] = useState('')
  const [riskLevelFilter, setRiskLevelFilter] = useState('')
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingEntity, setEditingEntity] = useState<UebaEntity | null>(null)

  const pagination = usePagination({ initialPage: 1, initialLimit: 10 })
  const debouncedQuery = useDebounce(searchQuery, 400)

  const createEntity = useCreateUebaEntity()
  const updateEntity = useUpdateUebaEntity()
  const deleteEntity = useDeleteUebaEntity()

  const searchParams: UebaEntitySearchParams = {
    page: pagination.page,
    limit: pagination.limit,
  }

  if (debouncedQuery.length > 0) {
    searchParams.query = debouncedQuery
  }

  if (entityTypeFilter.length > 0) {
    searchParams.entityType = entityTypeFilter
  }

  if (riskLevelFilter.length > 0) {
    searchParams.riskLevel = riskLevelFilter
  }

  const { data, isFetching } = useUebaEntities(searchParams)
  const { data: statsData } = useUebaStats()

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

  const handleEntityTypeChange = useCallback(
    (value: string) => {
      setEntityTypeFilter(value === ALL_FILTER ? '' : value)
      pagination.setPage(1)
    },
    [pagination]
  )

  const handleRiskLevelChange = useCallback(
    (value: string) => {
      setRiskLevelFilter(value === ALL_FILTER ? '' : value)
      pagination.setPage(1)
    },
    [pagination]
  )

  const handleRowClick = useCallback((entity: UebaEntity) => {
    setSelectedEntityId(prev => (prev === entity.id ? null : entity.id))
  }, [])

  const handleCloseDetailPanel = useCallback(() => {
    setSelectedEntityId(null)
  }, [])

  const handleCreateSubmit = useCallback(
    (formData: CreateUebaEntityFormValues) => {
      createEntity.mutate(formData as unknown as Record<string, unknown>, {
        onSuccess: () => {
          Toast.success(t('entityCreated'))
          setCreateDialogOpen(false)
        },
        onError: (error: unknown) => {
          Toast.error(t(getErrorKey(error)))
        },
      })
    },
    [createEntity, t]
  )

  const handleEditOpen = useCallback((entity: UebaEntity) => {
    setEditingEntity(entity)
    setEditDialogOpen(true)
  }, [])

  const handleEditSubmit = useCallback(
    (formData: EditUebaEntityFormValues) => {
      if (!editingEntity) {
        return
      }
      updateEntity.mutate(
        { id: editingEntity.id, data: formData as unknown as Record<string, unknown> },
        {
          onSuccess: () => {
            Toast.success(t('entityUpdated'))
            setEditDialogOpen(false)
            setEditingEntity(null)
          },
          onError: (error: unknown) => {
            Toast.error(t(getErrorKey(error)))
          },
        }
      )
    },
    [editingEntity, updateEntity, t]
  )

  const handleDeleteEntity = useCallback(
    (entity: UebaEntity) => {
      deleteEntity.mutate(entity.id, {
        onSuccess: () => {
          Toast.success(t('entityDeleted'))
          if (selectedEntityId === entity.id) {
            setSelectedEntityId(null)
          }
        },
        onError: (error: unknown) => {
          Toast.error(t(getErrorKey(error)))
        },
      })
    },
    [deleteEntity, t, selectedEntityId]
  )

  const editInitialValues = useMemo(
    () => ({
      entityName: editingEntity?.entityName ?? '',
      entityType: editingEntity?.entityType ?? UebaEntityType.USER,
      department: editingEntity?.department ?? '',
    }),
    [editingEntity?.entityName, editingEntity?.entityType, editingEntity?.department]
  )

  const columns = useMemo(() => getUebaColumns({ ueba: t }), [t])

  return {
    t,
    tCommon,
    searchQuery,
    setSearchQuery: handleSearchChange,
    entityTypeFilter: entityTypeFilter.length > 0 ? entityTypeFilter : ALL_FILTER,
    setEntityTypeFilter: handleEntityTypeChange,
    riskLevelFilter: riskLevelFilter.length > 0 ? riskLevelFilter : ALL_FILTER,
    setRiskLevelFilter: handleRiskLevelChange,
    isFetching,
    data,
    stats: statsData?.data ?? null,
    pagination,
    columns,
    selectedEntityId,
    handleRowClick,
    handleCloseDetailPanel,
    createDialogOpen,
    setCreateDialogOpen,
    handleCreateSubmit,
    createLoading: createEntity.isPending,
    editDialogOpen,
    setEditDialogOpen,
    handleEditOpen,
    handleEditSubmit,
    editLoading: updateEntity.isPending,
    editingEntity,
    editInitialValues,
    handleDeleteEntity,
    deleteLoading: deleteEntity.isPending,
  }
}
