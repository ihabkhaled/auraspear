'use client'

import { useCallback, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { SweetAlertDialog, SweetAlertIcon, Toast } from '@/components/common'
import { Permission } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { hasPermission } from '@/lib/permissions'
import { useAuthStore, useTenantStore } from '@/stores'
import { useAiGenerateRunbook, useAiSearchKnowledge } from './useAiKnowledge'
import { useRunbooks, useCreateRunbook, useUpdateRunbook, useDeleteRunbook } from './useRunbooks'
import type {
  CreateRunbookFormValues,
  EditRunbookFormValues,
  RunbookColumnTranslations,
  RunbookRecord,
} from '@/types'
import type { Column } from '@/components/common/DataTable'

function buildColumns(
  ct: RunbookColumnTranslations
): Column<RunbookRecord>[] {
  return [
    { key: 'title', label: ct.title, sortable: true },
    { key: 'category', label: ct.category, sortable: true },
    { key: 'tags', label: ct.tags },
    { key: 'createdBy', label: ct.createdBy },
    { key: 'updatedAt', label: ct.updatedAt, sortable: true },
  ]
}

export function useKnowledgePage() {
  const t = useTranslations('knowledge')
  const tCommon = useTranslations('common')
  const tErrors = useTranslations('errors')
  const permissions = useAuthStore(s => s.permissions)
  const tenantId = useTenantStore(s => s.currentTenantId)

  // Permissions
  const canCreate = hasPermission(permissions, Permission.RUNBOOKS_CREATE)
  const canEdit = hasPermission(permissions, Permission.RUNBOOKS_UPDATE)
  const canDelete = hasPermission(permissions, Permission.RUNBOOKS_DELETE)

  // Filters
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: 20,
      q: searchQuery.length > 0 ? searchQuery : undefined,
      category: categoryFilter.length > 0 ? categoryFilter : undefined,
      sortBy,
      sortOrder,
    }),
    [currentPage, searchQuery, categoryFilter, sortBy, sortOrder]
  )

  const { data: response, isLoading, isFetching } = useRunbooks(queryParams)
  const data = response?.data ?? []
  const pagination = response?.pagination

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedRunbook, setSelectedRunbook] = useState<RunbookRecord | null>(null)
  const [detailRunbook, setDetailRunbook] = useState<RunbookRecord | null>(null)

  // Mutations
  const createMutation = useCreateRunbook()
  const updateMutation = useUpdateRunbook()
  const deleteMutation = useDeleteRunbook()

  // AI
  const aiGenerateMutation = useAiGenerateRunbook()
  const aiSearchMutation = useAiSearchKnowledge()

  // Columns
  const columnTranslations: RunbookColumnTranslations = useMemo(
    () => ({
      title: t('colTitle'),
      category: t('colCategory'),
      tags: t('colTags'),
      createdBy: t('colCreatedBy'),
      actions: t('colActions'),
      updatedAt: tCommon('updatedAt'),
    }),
    [t, tCommon]
  )

  const columns = useMemo(() => buildColumns(columnTranslations), [columnTranslations])

  // Handlers
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value)
      setCurrentPage(1)
    },
    []
  )

  const handleCategoryChange = useCallback(
    (value: string) => {
      setCategoryFilter(value)
      setCurrentPage(1)
    },
    []
  )

  const handleSort = useCallback(
    (field: string) => {
      if (sortBy === field) {
        setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortBy(field)
        setSortOrder('desc')
      }
      setCurrentPage(1)
    },
    [sortBy]
  )

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleRowClick = useCallback((runbook: RunbookRecord) => {
    setDetailRunbook(runbook)
  }, [])

  const handleCreate = useCallback(
    (values: CreateRunbookFormValues) => {
      const tags = values.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      createMutation.mutate(
        {
          title: values.title,
          content: values.content,
          category: values.category.length > 0 ? values.category : undefined,
          tags: tags.length > 0 ? tags : undefined,
        },
        {
          onSuccess: () => {
            Toast.success(t('runbookCreated'))
            setCreateOpen(false)
          },
          onError: (error) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [createMutation, t, tErrors]
  )

  const handleEdit = useCallback(
    (values: EditRunbookFormValues) => {
      if (!selectedRunbook) {
        return
      }
      const tags = values.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      updateMutation.mutate(
        {
          id: selectedRunbook.id,
          data: {
            title: values.title,
            content: values.content,
            category: values.category.length > 0 ? values.category : undefined,
            tags: tags.length > 0 ? tags : undefined,
          },
        },
        {
          onSuccess: () => {
            Toast.success(t('runbookUpdated'))
            setEditOpen(false)
            setSelectedRunbook(null)
          },
          onError: (error) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [updateMutation, selectedRunbook, t, tErrors]
  )

  const handleDelete = useCallback(
    async (runbook: RunbookRecord) => {
      const confirmed = await SweetAlertDialog.show({
        text: t('deleteConfirm'),
        icon: SweetAlertIcon.QUESTION,
      })
      if (!confirmed) {
        return
      }
      deleteMutation.mutate(runbook.id, {
        onSuccess: () => {
          Toast.success(t('runbookDeleted'))
          if (detailRunbook?.id === runbook.id) {
            setDetailRunbook(null)
          }
        },
        onError: (error) => {
          Toast.error(tErrors(getErrorKey(error)))
        },
      })
    },
    [deleteMutation, t, tErrors, detailRunbook]
  )

  const openEditDialog = useCallback(
    (runbook: RunbookRecord) => {
      setSelectedRunbook(runbook)
      setEditOpen(true)
    },
    []
  )

  const handleAiGenerate = useCallback(
    (description: string) => {
      aiGenerateMutation.mutate(description)
    },
    [aiGenerateMutation]
  )

  const handleAiSearch = useCallback(
    (query: string) => {
      aiSearchMutation.mutate(query)
    },
    [aiSearchMutation]
  )

  return {
    t,
    tCommon,
    tenantId,
    data,
    columns,
    isLoading,
    isFetching,
    pagination,
    currentPage,
    searchQuery,
    categoryFilter,
    sortBy,
    sortOrder,
    handleSearchChange,
    handleCategoryChange,
    handleSort,
    handlePageChange,
    handleRowClick,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    selectedRunbook,
    detailRunbook,
    setDetailRunbook,
    handleCreate,
    handleEdit,
    handleDelete,
    openEditDialog,
    createLoading: createMutation.isPending,
    editLoading: updateMutation.isPending,
    canCreate,
    canEdit,
    canDelete,
    aiGenerate: {
      mutate: handleAiGenerate,
      data: aiGenerateMutation.data,
      isPending: aiGenerateMutation.isPending,
    },
    aiSearch: {
      mutate: handleAiSearch,
      data: aiSearchMutation.data,
      isPending: aiSearchMutation.isPending,
    },
  }
}
