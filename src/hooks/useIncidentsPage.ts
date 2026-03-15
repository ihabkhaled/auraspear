'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { getIncidentColumns } from '@/components/incidents'
import { IncidentCategory, IncidentSeverity, IncidentStatus, SortOrder } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import type {
  CreateIncidentFormValues,
  EditIncidentFormValues,
  Incident,
  IncidentSearchParams,
} from '@/types'
import { useTenantMembers } from './useCases'
import { useDebounce } from './useDebounce'
import { useIncidentDeleteDialog } from './useIncidentDeleteDialog'
import {
  useIncidents,
  useIncidentStats,
  useCreateIncident,
  useUpdateIncident,
  useDeleteIncident,
} from './useIncidents'
import { usePagination } from './usePagination'

const ALL_FILTER = '__all__'

export function useIncidentsPage() {
  const t = useTranslations('incidents')
  const tCommon = useTranslations('common')

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [detailPanelOpen, setDetailPanelOpen] = useState(false)
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null)
  const [detailIncident, setDetailIncident] = useState<Incident | null>(null)

  const pagination = usePagination({ initialPage: 1, initialLimit: 10 })
  const debouncedSearch = useDebounce(searchQuery, 400)

  const searchParams: IncidentSearchParams = {
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
  if (severityFilter.length > 0) {
    searchParams.severity = severityFilter
  }
  if (categoryFilter.length > 0) {
    searchParams.category = categoryFilter
  }

  const { data, isFetching, isLoading } = useIncidents(searchParams)
  const { data: statsData, isLoading: statsLoading } = useIncidentStats()
  const { data: membersData } = useTenantMembers()
  const createMutation = useCreateIncident()
  const updateMutation = useUpdateIncident()
  const deleteMutation = useDeleteIncident()
  const { confirmDelete } = useIncidentDeleteDialog()

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

  const handleSeverityChange = useCallback(
    (value: string) => {
      pagination.setPage(1)
      setSeverityFilter(value === ALL_FILTER ? '' : value)
    },
    [pagination]
  )

  const handleCategoryChange = useCallback(
    (value: string) => {
      pagination.setPage(1)
      setCategoryFilter(value === ALL_FILTER ? '' : value)
    },
    [pagination]
  )

  const handleClearAllFilters = useCallback(() => {
    pagination.setPage(1)
    setSearchQuery('')
    setStatusFilter('')
    setSeverityFilter('')
    setCategoryFilter('')
  }, [pagination])

  const handleSort = useCallback(
    (key: string, order: SortOrder) => {
      pagination.setPage(1)
      setSortBy(key)
      setSortOrder(order)
    },
    [pagination]
  )

  const handleRowClick = useCallback((incident: Incident) => {
    setDetailIncident(incident)
    setDetailPanelOpen(true)
  }, [])

  const handleCreate = useCallback(
    (formData: CreateIncidentFormValues) => {
      const payload: Record<string, unknown> = {
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        category: formData.category,
      }
      if (formData.assigneeId) {
        payload['assigneeId'] = formData.assigneeId
      }
      if (formData.mitreTechniques && formData.mitreTechniques.trim().length > 0) {
        payload['mitreTechniques'] = formData.mitreTechniques
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0)
      }
      createMutation.mutate(payload, {
        onSuccess: () => {
          Toast.success(t('createSuccess'))
          setCreateDialogOpen(false)
        },
        onError: (error: unknown) => {
          Toast.error(t(getErrorKey(error)))
        },
      })
    },
    [createMutation, t]
  )

  const handleEdit = useCallback(
    (formData: EditIncidentFormValues) => {
      if (!editingIncident) {
        return
      }
      const payload: Record<string, unknown> = {
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        category: formData.category,
        status: formData.status,
      }
      if (formData.assigneeId) {
        payload['assigneeId'] = formData.assigneeId
      }
      if (formData.mitreTechniques && formData.mitreTechniques.trim().length > 0) {
        payload['mitreTechniques'] = formData.mitreTechniques
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0)
      }
      if (
        formData.status === IncidentStatus.RESOLVED &&
        editingIncident.status !== IncidentStatus.RESOLVED
      ) {
        payload['resolvedAt'] = new Date().toISOString()
      }
      updateMutation.mutate(
        { id: editingIncident.id, data: payload },
        {
          onSuccess: () => {
            Toast.success(t('updateSuccess'))
            setEditDialogOpen(false)
            setEditingIncident(null)
          },
          onError: (error: unknown) => {
            Toast.error(t(getErrorKey(error)))
          },
        }
      )
    },
    [editingIncident, updateMutation, t]
  )

  const handleDelete = useCallback(
    async (incident: Incident) => {
      const confirmed = await confirmDelete(incident.incidentNumber, incident.title)
      if (!confirmed) {
        return
      }
      deleteMutation.mutate(incident.id, {
        onSuccess: () => {
          Toast.success(t('deleteSuccess'))
        },
        onError: () => {
          Toast.error(t('deleteError'))
        },
      })
    },
    [confirmDelete, deleteMutation, t]
  )

  const handleOpenEdit = useCallback((incident: Incident) => {
    setEditingIncident(incident)
    setEditDialogOpen(true)
  }, [])

  const handleCopyId = useCallback(
    (id: string) => {
      void navigator.clipboard.writeText(id)
      Toast.success(tCommon('copied'))
    },
    [tCommon]
  )

  const columns = useMemo(() => getIncidentColumns({ incidents: t, common: tCommon }), [t, tCommon])

  const stats = statsData?.data

  const assigneeOptions = useMemo(
    () => (membersData?.data ?? []).map(m => ({ value: m.id, label: m.name })),
    [membersData?.data]
  )

  const editInitialValues = useMemo(
    () => ({
      title: editingIncident?.title ?? '',
      description: editingIncident?.description ?? '',
      severity: editingIncident?.severity ?? IncidentSeverity.MEDIUM,
      category: editingIncident?.category ?? IncidentCategory.OTHER,
      status: editingIncident?.status ?? IncidentStatus.OPEN,
      assigneeId: editingIncident?.assigneeId ?? undefined,
      mitreTechniques: editingIncident?.mitreTechniques?.join(', ') ?? '',
    }),
    [editingIncident]
  )

  return {
    t,
    tCommon,
    data,
    stats,
    statsLoading,
    columns,
    isLoading,
    isFetching,
    pagination,
    searchQuery,
    statusFilter: statusFilter.length > 0 ? statusFilter : ALL_FILTER,
    severityFilter: severityFilter.length > 0 ? severityFilter : ALL_FILTER,
    categoryFilter: categoryFilter.length > 0 ? categoryFilter : ALL_FILTER,
    sortBy,
    sortOrder,
    createDialogOpen,
    editDialogOpen,
    detailPanelOpen,
    editingIncident,
    detailIncident,
    editInitialValues,
    createLoading: createMutation.isPending,
    editLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
    assigneeOptions,
    handleSearchChange,
    handleStatusChange,
    handleSeverityChange,
    handleCategoryChange,
    handleClearAllFilters,
    handleSort,
    handleRowClick,
    handleCreate,
    handleEdit,
    handleDelete,
    handleOpenEdit,
    handleCopyId,
    setCreateDialogOpen,
    setEditDialogOpen,
    setDetailPanelOpen,
    setDetailIncident,
  }
}
