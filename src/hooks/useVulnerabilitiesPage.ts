'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { getVulnerabilityColumns } from '@/components/vulnerabilities'
import { SortOrder } from '@/enums'
import type { Vulnerability, VulnerabilitySearchParams } from '@/types'
import { useDebounce } from './useDebounce'
import { usePagination } from './usePagination'
import { useVulnerabilities, useVulnerabilityStats } from './useVulnerabilities'
import { useVulnerabilityDeleteDialog } from './useVulnerabilityDeleteDialog'

export function useVulnerabilitiesPage() {
  const t = useTranslations('vulnerabilities')

  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const [patchStatusFilter, setPatchStatusFilter] = useState('')
  const [exploitFilter, setExploitFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC)

  // CRUD dialog state
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [bulkImportOpen, setBulkImportOpen] = useState(false)
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null)

  const { confirmDelete, isDeleting } = useVulnerabilityDeleteDialog()

  const pagination = usePagination({ initialPage: 1, initialLimit: 10 })
  const debouncedQuery = useDebounce(searchQuery, 400)

  const searchParams: VulnerabilitySearchParams = {
    page: pagination.page,
    limit: pagination.limit,
    sortBy,
    sortOrder,
  }

  if (severityFilter.length > 0) {
    searchParams.severity = severityFilter
  }

  if (patchStatusFilter.length > 0) {
    searchParams.patchStatus = patchStatusFilter
  }

  if (exploitFilter.length > 0) {
    searchParams.exploitAvailable = exploitFilter
  }

  if (debouncedQuery.length > 0) {
    searchParams.query = debouncedQuery
  }

  const { data, isFetching } = useVulnerabilities(searchParams)
  const { data: statsData } = useVulnerabilityStats()

  useEffect(() => {
    if (data?.pagination) {
      pagination.setTotal(data.pagination.total)
    }
  }, [data?.pagination, pagination])

  const handleSeverityChange = useCallback(
    (value: string) => {
      setSeverityFilter(value)
      pagination.setPage(1)
    },
    [pagination]
  )

  const handlePatchStatusChange = useCallback(
    (value: string) => {
      setPatchStatusFilter(value)
      pagination.setPage(1)
    },
    [pagination]
  )

  const handleExploitChange = useCallback(
    (value: string) => {
      setExploitFilter(value)
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

  const handleRowClick = useCallback((vulnerability: Vulnerability) => {
    setSelectedVulnerability(vulnerability)
    setDetailOpen(true)
  }, [])

  const handleEditFromDetail = useCallback((vulnerability: Vulnerability) => {
    setSelectedVulnerability(vulnerability)
    setDetailOpen(false)
    setEditOpen(true)
  }, [])

  const handleDeleteFromDetail = useCallback(
    (vulnerability: Vulnerability) => {
      setDetailOpen(false)
      void confirmDelete(vulnerability)
    },
    [confirmDelete]
  )

  const handleOpenCreate = useCallback(() => {
    setCreateOpen(true)
  }, [])

  const handleOpenBulkImport = useCallback(() => {
    setBulkImportOpen(true)
  }, [])

  const columns = useMemo(() => getVulnerabilityColumns({ vulnerabilities: t }), [t])

  return {
    t,
    searchQuery,
    setSearchQuery: handleSearchChange,
    severityFilter,
    setSeverityFilter: handleSeverityChange,
    patchStatusFilter,
    setPatchStatusFilter: handlePatchStatusChange,
    exploitFilter,
    setExploitFilter: handleExploitChange,
    sortBy,
    sortOrder,
    handleSort,
    isFetching,
    data,
    stats: statsData?.data ?? null,
    pagination,
    columns,
    // CRUD state
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    detailOpen,
    setDetailOpen,
    bulkImportOpen,
    setBulkImportOpen,
    selectedVulnerability,
    isDeleting,
    // Handlers
    handleRowClick,
    handleEditFromDetail,
    handleDeleteFromDetail,
    handleOpenCreate,
    handleOpenBulkImport,
  }
}
