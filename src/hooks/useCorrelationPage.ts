import { useState, useCallback, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { getCorrelationColumns } from '@/components/correlation'
import { RuleSource, SortOrder } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { lookup, safeJsonParse } from '@/lib/utils'
import type {
  CorrelationRule,
  CorrelationSearchParams,
  CorrelationCreateFormValues,
  CorrelationEditFormValues,
} from '@/types'
import {
  useCorrelationRules,
  useCorrelationStats,
  useCreateRule,
  useUpdateRule,
  useDeleteRule,
} from './useCorrelation'
import { useDebounce } from './useDebounce'
import { usePagination } from './usePagination'

const TAB_SOURCE_MAP: Record<string, RuleSource | undefined> = {
  all: undefined,
  sigma: RuleSource.SIGMA,
  custom: RuleSource.CUSTOM,
  ai: RuleSource.AI_GENERATED,
}

export function useCorrelationPage() {
  const t = useTranslations('correlation')
  const tError = useTranslations('errors')

  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC)
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null)

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<CorrelationRule | null>(null)
  const [deletingRule, setDeletingRule] = useState<CorrelationRule | null>(null)
  const [detailPanelOpen, setDetailPanelOpen] = useState(false)

  const pagination = usePagination({ initialPage: 1, initialLimit: 10 })
  const debouncedQuery = useDebounce(searchQuery, 400)

  const createMutation = useCreateRule()
  const updateMutation = useUpdateRule()
  const deleteMutation = useDeleteRule()

  const searchParams: CorrelationSearchParams = {
    page: pagination.page,
    limit: pagination.limit,
    sortBy,
    sortOrder,
  }

  const sourceFromTab = lookup(TAB_SOURCE_MAP, activeTab)
  if (sourceFromTab) {
    searchParams.source = sourceFromTab
  }

  if (severityFilter.length > 0) {
    searchParams.severity = severityFilter
  }

  if (statusFilter.length > 0) {
    searchParams.status = statusFilter
  }

  if (debouncedQuery.length > 0) {
    searchParams.query = debouncedQuery
  }

  const { data, isFetching } = useCorrelationRules(searchParams)
  const { data: statsData } = useCorrelationStats()

  useEffect(() => {
    if (data?.pagination) {
      pagination.setTotal(data.pagination.total)
    }
  }, [data?.pagination, pagination])

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab)
      pagination.setPage(1)
    },
    [pagination]
  )

  const handleSeverityFilterChange = useCallback(
    (value: string) => {
      setSeverityFilter(value)
      pagination.setPage(1)
    },
    [pagination]
  )

  const handleStatusFilterChange = useCallback(
    (value: string) => {
      setStatusFilter(value)
      pagination.setPage(1)
    },
    [pagination]
  )

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value)
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

  const handleRowClick = useCallback((rule: CorrelationRule) => {
    setSelectedRuleId(rule.id)
    setDetailPanelOpen(true)
  }, [])

  const selectedRule = useMemo(() => {
    const rules = data?.data
    if (!selectedRuleId || !rules) {
      return null
    }
    return rules.find(r => r.id === selectedRuleId) ?? null
  }, [selectedRuleId, data])

  const columns = useMemo(() => getCorrelationColumns({ correlation: t }), [t])

  const handleCreateSubmit = useCallback(
    (formData: CorrelationCreateFormValues) => {
      const payload: Record<string, unknown> = {
        title: formData.title,
        description: formData.description,
        source: formData.source,
        severity: formData.severity,
        status: formData.status,
        mitreTechniques: formData.mitreTechniques
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0),
        yamlContent: formData.yamlContent || null,
        conditions:
          formData.conditions.trim().length > 0
            ? safeJsonParse<Record<string, unknown>>(formData.conditions, {})
            : null,
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

  const handleEditSubmit = useCallback(
    (formData: CorrelationEditFormValues) => {
      if (!editingRule) return

      const payload: Record<string, unknown> = {
        title: formData.title,
        description: formData.description,
        source: formData.source,
        severity: formData.severity,
        status: formData.status,
        mitreTechniques: formData.mitreTechniques
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0),
        yamlContent: formData.yamlContent || null,
        conditions:
          formData.conditions.trim().length > 0
            ? safeJsonParse<Record<string, unknown>>(formData.conditions, {})
            : null,
      }

      updateMutation.mutate(
        { id: editingRule.id, data: payload },
        {
          onSuccess: () => {
            Toast.success(t('updateSuccess'))
            setEditDialogOpen(false)
            setEditingRule(null)
          },
          onError: (error: unknown) => {
            Toast.error(tError(getErrorKey(error)))
          },
        }
      )
    },
    [editingRule, updateMutation, t, tError]
  )

  const handleDeleteConfirm = useCallback(
    (id: string) => {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          Toast.success(t('deleteSuccess'))
          setDeletingRule(null)
          if (selectedRuleId === id) {
            setSelectedRuleId(null)
            setDetailPanelOpen(false)
          }
        },
        onError: (error: unknown) => {
          Toast.error(tError(getErrorKey(error)))
        },
      })
    },
    [deleteMutation, selectedRuleId, t, tError]
  )

  const handleOpenCreate = useCallback(() => {
    setCreateDialogOpen(true)
  }, [])

  const handleOpenEdit = useCallback((rule: CorrelationRule) => {
    setEditingRule(rule)
    setEditDialogOpen(true)
  }, [])

  const handleOpenDelete = useCallback((rule: CorrelationRule) => {
    setDeletingRule(rule)
  }, [])

  return {
    t,
    searchQuery,
    setSearchQuery: handleSearchChange,
    activeTab,
    setActiveTab: handleTabChange,
    severityFilter,
    setSeverityFilter: handleSeverityFilterChange,
    statusFilter,
    setStatusFilter: handleStatusFilterChange,
    selectedRule,
    setSelectedRuleId,
    isFetching,
    data,
    stats: statsData?.data ?? null,
    pagination,
    columns,
    sortBy,
    sortOrder,
    handleSort,
    handleRowClick,
    createDialogOpen,
    setCreateDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    editingRule,
    deletingRule,
    detailPanelOpen,
    setDetailPanelOpen,
    handleCreateSubmit,
    handleEditSubmit,
    handleDeleteConfirm,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
