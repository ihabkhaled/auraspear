'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { getCloudSecurityColumns } from '@/components/cloud-security/CloudSecurityTableColumns'
import { Toast } from '@/components/common'
import { SortOrder } from '@/enums'
import type {
  CloudAccount,
  CloudAccountSearchParams,
  CloudFinding,
  CreateCloudAccountFormValues,
  EditCloudAccountFormValues,
} from '@/types'
import {
  useCloudAccounts,
  useCloudSecurityStats,
  useCreateCloudAccount,
  useUpdateCloudAccount,
  useDeleteCloudAccount,
  useCloudFindings,
} from './useCloudSecurity'
import { useDebounce } from './useDebounce'
import { usePagination } from './usePagination'

const ALL_FILTER = '__all__'

export function useCloudSecurityPage() {
  const t = useTranslations('cloudSecurity')
  const tCommon = useTranslations('common')

  const [searchQuery, setSearchQuery] = useState('')
  const [providerFilter, setProviderFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC)

  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<CloudAccount | null>(null)
  const [accountFindings, setAccountFindings] = useState<CloudFinding[]>([])

  const pagination = usePagination({ initialPage: 1, initialLimit: 10 })
  const debouncedSearch = useDebounce(searchQuery, 400)

  const searchParams: CloudAccountSearchParams = {
    page: pagination.page,
    limit: pagination.limit,
    sortBy,
    sortOrder,
  }

  if (debouncedSearch.length > 0) {
    searchParams.query = debouncedSearch
  }
  if (providerFilter.length > 0) {
    searchParams.provider = providerFilter
  }
  if (statusFilter.length > 0) {
    searchParams.status = statusFilter
  }

  const { data, isFetching } = useCloudAccounts(searchParams)
  const { data: statsData, isLoading: statsLoading } = useCloudSecurityStats()
  const { data: findingsData } = useCloudFindings()
  const createMutation = useCreateCloudAccount()
  const updateMutation = useUpdateCloudAccount()
  const deleteMutation = useDeleteCloudAccount()

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

  const handleProviderChange = useCallback(
    (value: string) => {
      pagination.setPage(1)
      setProviderFilter(value === ALL_FILTER ? '' : value)
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
    (formData: CreateCloudAccountFormValues) => {
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
    (formData: EditCloudAccountFormValues) => {
      if (!selectedAccount) return
      updateMutation.mutate(
        { id: selectedAccount.id, data: formData as unknown as Record<string, unknown> },
        {
          onSuccess: () => {
            Toast.success(t('editSuccess'))
            setEditOpen(false)
            setSelectedAccount(null)
          },
          onError: () => {
            Toast.error(t('editError'))
          },
        }
      )
    },
    [updateMutation, selectedAccount, t]
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

  const handleOpenDetail = useCallback(
    (account: CloudAccount) => {
      setSelectedAccount(account)
      const filtered =
        findingsData?.data?.filter((f: CloudFinding) => f.cloudAccountId === account.id) ?? []
      setAccountFindings(filtered)
      setDetailOpen(true)
    },
    [findingsData]
  )

  const handleOpenEdit = useCallback((account: CloudAccount) => {
    setSelectedAccount(account)
    setEditOpen(true)
  }, [])

  const columns = useMemo(
    () => getCloudSecurityColumns({ cloudSecurity: t, common: tCommon }),
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
    providerFilter: providerFilter.length > 0 ? providerFilter : ALL_FILTER,
    statusFilter: statusFilter.length > 0 ? statusFilter : ALL_FILTER,
    sortBy,
    sortOrder,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    detailOpen,
    setDetailOpen,
    selectedAccount,
    accountFindings,
    createLoading: createMutation.isPending,
    editLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
    handleSearchChange,
    handleProviderChange,
    handleStatusChange,
    handleSort,
    handleCreate,
    handleEdit,
    handleDelete,
    handleOpenDetail,
    handleOpenEdit,
  }
}
