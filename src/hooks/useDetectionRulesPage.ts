'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { getDetectionRuleColumns } from '@/components/detection-rules/DetectionRuleTableColumns'
import { SortOrder } from '@/enums'
import type {
  CreateDetectionRuleFormValues,
  DetectionRule,
  DetectionRuleSearchParams,
  EditDetectionRuleFormValues,
} from '@/types'
import { useDebounce } from './useDebounce'
import {
  useDetectionRules,
  useDetectionRuleStats,
  useCreateDetectionRule,
  useUpdateDetectionRule,
  useDeleteDetectionRule,
} from './useDetectionRules'
import { usePagination } from './usePagination'

const ALL_FILTER = '__all__'

export function useDetectionRulesPage() {
  const t = useTranslations('detectionRules')
  const tCommon = useTranslations('common')

  const [searchQuery, setSearchQuery] = useState('')
  const [ruleTypeFilter, setRuleTypeFilter] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC)

  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<DetectionRule | null>(null)

  const pagination = usePagination({ initialPage: 1, initialLimit: 10 })
  const debouncedSearch = useDebounce(searchQuery, 400)

  const searchParams: DetectionRuleSearchParams = {
    page: pagination.page,
    limit: pagination.limit,
    sortBy,
    sortOrder,
  }

  if (debouncedSearch.length > 0) {
    searchParams.query = debouncedSearch
  }
  if (ruleTypeFilter.length > 0) {
    searchParams.ruleType = ruleTypeFilter
  }
  if (severityFilter.length > 0) {
    searchParams.severity = severityFilter
  }
  if (statusFilter.length > 0) {
    searchParams.status = statusFilter
  }

  const { data, isFetching } = useDetectionRules(searchParams)
  const { data: statsData, isLoading: statsLoading } = useDetectionRuleStats()
  const createMutation = useCreateDetectionRule()
  const updateMutation = useUpdateDetectionRule()
  const deleteMutation = useDeleteDetectionRule()

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

  const handleRuleTypeChange = useCallback(
    (value: string) => {
      pagination.setPage(1)
      setRuleTypeFilter(value === ALL_FILTER ? '' : value)
    },
    [pagination]
  )

  const handleSeverityChange = useCallback(
    (value: string) => {
      pagination.setPage(1)
      setSeverityFilter(value === ALL_FILTER ? '' : value)
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
    (formData: CreateDetectionRuleFormValues) => {
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
    (formData: EditDetectionRuleFormValues) => {
      if (!selectedRule) return
      updateMutation.mutate(
        { id: selectedRule.id, data: formData as unknown as Record<string, unknown> },
        {
          onSuccess: () => {
            Toast.success(t('editSuccess'))
            setEditOpen(false)
            setSelectedRule(null)
          },
          onError: () => {
            Toast.error(t('editError'))
          },
        }
      )
    },
    [updateMutation, selectedRule, t]
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

  const handleOpenDetail = useCallback((rule: DetectionRule) => {
    setSelectedRule(rule)
    setDetailOpen(true)
  }, [])

  const handleOpenEdit = useCallback((rule: DetectionRule) => {
    setSelectedRule(rule)
    setEditOpen(true)
  }, [])

  const columns = useMemo(
    () => getDetectionRuleColumns({ detectionRules: t, common: tCommon }),
    [t, tCommon]
  )

  const stats = statsData?.data

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
    ruleTypeFilter: ruleTypeFilter.length > 0 ? ruleTypeFilter : ALL_FILTER,
    severityFilter: severityFilter.length > 0 ? severityFilter : ALL_FILTER,
    statusFilter: statusFilter.length > 0 ? statusFilter : ALL_FILTER,
    sortBy,
    sortOrder,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    detailOpen,
    setDetailOpen,
    selectedRule,
    createLoading: createMutation.isPending,
    editLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
    handleSearchChange,
    handleRuleTypeChange,
    handleSeverityChange,
    handleStatusChange,
    handleSort,
    handleCreate,
    handleEdit,
    handleDelete,
    handleOpenDetail,
    handleOpenEdit,
  }
}
