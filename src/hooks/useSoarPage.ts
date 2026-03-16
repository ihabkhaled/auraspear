'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { getSoarPlaybookColumns } from '@/components/soar'
import { SoarTriggerType, SortOrder } from '@/enums'
import { safeJsonParse } from '@/lib/utils'
import type {
  SoarPlaybook,
  SoarPlaybookSearchParams,
  CreateSoarPlaybookFormValues,
  EditSoarPlaybookFormValues,
} from '@/types'
import { useDebounce } from './useDebounce'
import { usePagination } from './usePagination'
import {
  usePlaybooks,
  usePlaybookStats,
  useCreatePlaybook,
  useUpdatePlaybook,
  useDeletePlaybook,
  useExecutePlaybook,
} from './useSoar'

const ALL_FILTER = '__all__'

export function useSoarPage() {
  const t = useTranslations('soar')
  const tCommon = useTranslations('common')

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [triggerFilter, setTriggerFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC)

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedPlaybook, setSelectedPlaybook] = useState<SoarPlaybook | null>(null)
  const [deletePlaybookId, setDeletePlaybookId] = useState<string | null>(null)
  const [deletePlaybookName, setDeletePlaybookName] = useState('')
  const [runPlaybookId, setRunPlaybookId] = useState<string | null>(null)
  const [runPlaybookName, setRunPlaybookName] = useState('')

  const pagination = usePagination({ initialPage: 1, initialLimit: 10 })
  const debouncedSearch = useDebounce(searchQuery, 400)

  const searchParams: SoarPlaybookSearchParams = {
    page: pagination.page,
    limit: pagination.limit,
    sortBy,
    sortOrder,
  }

  if (debouncedSearch.length > 0) {
    searchParams.query = debouncedSearch
  }
  if (statusFilter.length > 0) {
    searchParams.status = statusFilter
  }
  if (triggerFilter.length > 0) {
    searchParams.triggerType = triggerFilter
  }

  const { data, isFetching, isLoading } = usePlaybooks(searchParams)
  const { data: statsData } = usePlaybookStats()
  const createMutation = useCreatePlaybook()
  const updateMutation = useUpdatePlaybook()
  const deleteMutation = useDeletePlaybook()
  const executeMutation = useExecutePlaybook()

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

  const handleStatusChange = useCallback(
    (value: string) => {
      pagination.setPage(1)
      setStatusFilter(value === ALL_FILTER ? '' : value)
    },
    [pagination]
  )

  const handleTriggerChange = useCallback(
    (value: string) => {
      pagination.setPage(1)
      setTriggerFilter(value === ALL_FILTER ? '' : value)
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

  const handleRowClick = useCallback((playbook: SoarPlaybook) => {
    setSelectedPlaybook(playbook)
    setDetailOpen(true)
  }, [])

  const handleCreate = useCallback(
    (formData: CreateSoarPlaybookFormValues) => {
      const payload: Record<string, unknown> = {
        name: formData.name,
        description: formData.description,
        triggerType: formData.triggerType,
        steps: safeJsonParse<unknown[]>(formData.steps, []),
      }
      if (formData.triggerConditions && formData.triggerConditions.trim().length > 0) {
        payload['triggerConditions'] = safeJsonParse<Record<string, unknown>>(
          formData.triggerConditions,
          {}
        )
      }
      if (formData.cronExpression.length > 0) {
        payload['cronExpression'] = formData.cronExpression
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
    (formData: EditSoarPlaybookFormValues) => {
      if (!selectedPlaybook) {
        return
      }
      const payload: Record<string, unknown> = {
        name: formData.name,
        description: formData.description,
        triggerType: formData.triggerType,
        steps: safeJsonParse<unknown[]>(formData.steps, []),
      }
      if (formData.triggerConditions && formData.triggerConditions.trim().length > 0) {
        payload['triggerConditions'] = safeJsonParse<Record<string, unknown>>(
          formData.triggerConditions,
          {}
        )
      }
      if (formData.cronExpression.length > 0) {
        payload['cronExpression'] = formData.cronExpression
      }
      updateMutation.mutate(
        { id: selectedPlaybook.id, data: payload },
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
    [updateMutation, selectedPlaybook, t]
  )

  const handleDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          Toast.success(t('deleteSuccess'))
          setDeletePlaybookId(null)
        },
        onError: () => {
          Toast.error(t('deleteError'))
        },
      })
    },
    [deleteMutation, t]
  )

  const handleExecute = useCallback(
    (id: string) => {
      executeMutation.mutate(id, {
        onSuccess: () => {
          Toast.success(t('executeSuccess'))
          setRunPlaybookId(null)
        },
        onError: () => {
          Toast.error(t('executeError'))
        },
      })
    },
    [executeMutation, t]
  )

  const openEditDialog = useCallback((playbook: SoarPlaybook) => {
    setDetailOpen(false)
    setSelectedPlaybook(playbook)
    setEditOpen(true)
  }, [])

  const openDeleteDialog = useCallback((playbook: SoarPlaybook) => {
    setDetailOpen(false)
    setDeletePlaybookId(playbook.id)
    setDeletePlaybookName(playbook.name)
  }, [])

  const openRunDialog = useCallback((playbook: SoarPlaybook) => {
    setDetailOpen(false)
    setRunPlaybookId(playbook.id)
    setRunPlaybookName(playbook.name)
  }, [])

  const editInitialValues: EditSoarPlaybookFormValues = useMemo(
    () => ({
      name: selectedPlaybook?.name ?? '',
      description: selectedPlaybook?.description ?? '',
      triggerType: selectedPlaybook?.triggerType ?? SoarTriggerType.MANUAL,
      steps: '[]',
      triggerConditions: '',
      cronExpression: '',
    }),
    [selectedPlaybook]
  )

  const columns = useMemo(() => getSoarPlaybookColumns({ soar: t, common: tCommon }), [t, tCommon])

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
    statusFilter: statusFilter.length > 0 ? statusFilter : ALL_FILTER,
    triggerFilter: triggerFilter.length > 0 ? triggerFilter : ALL_FILTER,
    sortBy,
    sortOrder,
    handleSearchChange,
    handleStatusChange,
    handleTriggerChange,
    handleSort,
    handleRowClick,
    // CRUD
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    detailOpen,
    setDetailOpen,
    selectedPlaybook,
    deletePlaybookId,
    deletePlaybookName,
    runPlaybookId,
    runPlaybookName,
    editInitialValues,
    handleCreate,
    handleEdit,
    handleDelete,
    handleExecute,
    openEditDialog,
    openDeleteDialog,
    openRunDialog,
    createLoading: createMutation.isPending,
    editLoading: updateMutation.isPending,
  }
}
