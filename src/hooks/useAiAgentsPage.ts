'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { getAiAgentColumns } from '@/components/ai-agents'
import { Toast } from '@/components/common'
import { getErrorKey } from '@/lib/api-error'
import type {
  AiAgent,
  AiAgentSearchParams,
  CreateAiAgentFormValues,
  EditAiAgentFormValues,
} from '@/types'
import {
  useAiAgents,
  useAiAgentStats,
  useCreateAiAgent,
  useUpdateAiAgent,
  useDeleteAiAgent,
} from './useAiAgents'
import { useDebounce } from './useDebounce'
import { usePagination } from './usePagination'

const ALL_FILTER = '__all__'

export function useAiAgentsPage() {
  const t = useTranslations('aiAgents')
  const tErrors = useTranslations()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [tierFilter, setTierFilter] = useState('')
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editAgent, setEditAgent] = useState<AiAgent | null>(null)

  const pagination = usePagination({ initialPage: 1, initialLimit: 10 })
  const debouncedQuery = useDebounce(searchQuery, 400)

  const createMutation = useCreateAiAgent()
  const updateMutation = useUpdateAiAgent()
  const deleteMutation = useDeleteAiAgent()

  const searchParams: AiAgentSearchParams = {
    page: pagination.page,
    limit: pagination.limit,
  }

  if (debouncedQuery.length > 0) {
    searchParams.query = debouncedQuery
  }

  if (statusFilter.length > 0) {
    searchParams.status = statusFilter
  }

  if (tierFilter.length > 0) {
    searchParams.tier = tierFilter
  }

  const { data, isFetching } = useAiAgents(searchParams)
  const { data: statsData } = useAiAgentStats()

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

  const handleStatusChange = useCallback(
    (value: string) => {
      setStatusFilter(value === ALL_FILTER ? '' : value)
      pagination.setPage(1)
    },
    [pagination]
  )

  const handleTierChange = useCallback(
    (value: string) => {
      setTierFilter(value === ALL_FILTER ? '' : value)
      pagination.setPage(1)
    },
    [pagination]
  )

  const handleRowClick = useCallback((agent: AiAgent) => {
    setSelectedAgentId(prev => (prev === agent.id ? null : agent.id))
  }, [])

  const selectedAgent = useMemo(() => {
    const agents = data?.data
    if (!selectedAgentId || !agents) {
      return null
    }
    return agents.find(a => a.id === selectedAgentId) ?? null
  }, [selectedAgentId, data])

  const columns = useMemo(() => getAiAgentColumns({ aiAgents: t }), [t])

  const handleCreateSubmit = useCallback(
    (formData: CreateAiAgentFormValues) => {
      createMutation.mutate(formData as unknown as Record<string, unknown>, {
        onSuccess: () => {
          Toast.success(t('createSuccess'))
          setCreateDialogOpen(false)
        },
        onError: (error: unknown) => {
          Toast.error(tErrors(getErrorKey(error)))
        },
      })
    },
    [createMutation, t, tErrors]
  )

  const handleEditOpen = useCallback((agent: AiAgent) => {
    setEditAgent(agent)
    setEditDialogOpen(true)
  }, [])

  const handleEditSubmit = useCallback(
    (formData: EditAiAgentFormValues) => {
      if (!editAgent) return
      updateMutation.mutate(
        { id: editAgent.id, data: formData as unknown as Record<string, unknown> },
        {
          onSuccess: () => {
            Toast.success(t('updateSuccess'))
            setEditDialogOpen(false)
            setEditAgent(null)
          },
          onError: (error: unknown) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [editAgent, updateMutation, t, tErrors]
  )

  const handleDeleteConfirm = useCallback(
    (agentId: string) => {
      deleteMutation.mutate(agentId, {
        onSuccess: () => {
          Toast.success(t('deleteSuccess'))
          if (selectedAgentId === agentId) {
            setSelectedAgentId(null)
          }
        },
        onError: (error: unknown) => {
          Toast.error(tErrors(getErrorKey(error)))
        },
      })
    },
    [deleteMutation, selectedAgentId, t, tErrors]
  )

  const handleCloseDetail = useCallback(() => {
    setSelectedAgentId(null)
  }, [])

  const editInitialValues: EditAiAgentFormValues | null = useMemo(() => {
    if (!editAgent) return null
    return {
      name: editAgent.name,
      description: editAgent.description ?? '',
      model: editAgent.model,
      tier: editAgent.tier,
      soulMd: editAgent.soulMd ?? '',
    }
  }, [editAgent])

  return {
    t,
    searchQuery,
    setSearchQuery: handleSearchChange,
    statusFilter: statusFilter.length > 0 ? statusFilter : ALL_FILTER,
    setStatusFilter: handleStatusChange,
    tierFilter: tierFilter.length > 0 ? tierFilter : ALL_FILTER,
    setTierFilter: handleTierChange,
    isFetching,
    data,
    stats: statsData?.data ?? null,
    pagination,
    columns,
    selectedAgent,
    selectedAgentId,
    setSelectedAgentId,
    handleRowClick,
    createDialogOpen,
    setCreateDialogOpen,
    handleCreateSubmit,
    isCreating: createMutation.isPending,
    editDialogOpen,
    setEditDialogOpen,
    editAgent,
    editInitialValues,
    handleEditOpen,
    handleEditSubmit,
    isUpdating: updateMutation.isPending,
    handleDeleteConfirm,
    isDeleting: deleteMutation.isPending,
    handleCloseDetail,
  }
}
