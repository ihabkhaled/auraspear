'use client'

import { useReportsPageCrud } from './useReportsPageCrud'
import { useReportsPageDialogs } from './useReportsPageDialogs'
import { useReportsPageFilters } from './useReportsPageFilters'

export function useReportsPage() {
  const filters = useReportsPageFilters()
  const dialogs = useReportsPageDialogs()
  const crud = useReportsPageCrud(dialogs)

  return {
    t: filters.t,
    tCommon: filters.tCommon,
    data: filters.data,
    stats: filters.stats,
    columns: filters.columns,
    isLoading: filters.isLoading,
    isFetching: filters.isFetching,
    pagination: filters.pagination,
    searchQuery: filters.searchQuery,
    typeFilter: filters.typeFilter,
    formatFilter: filters.formatFilter,
    statusFilter: filters.statusFilter,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    handleSearchChange: filters.handleSearchChange,
    handleTypeChange: filters.handleTypeChange,
    handleFormatChange: filters.handleFormatChange,
    handleStatusChange: filters.handleStatusChange,
    handleSort: filters.handleSort,
    handleRowClick: dialogs.handleRowClick,
    createOpen: dialogs.createOpen,
    setCreateOpen: dialogs.setCreateOpen,
    editOpen: dialogs.editOpen,
    setEditOpen: dialogs.setEditOpen,
    detailOpen: dialogs.detailOpen,
    setDetailOpen: dialogs.setDetailOpen,
    selectedReport: dialogs.selectedReport,
    deleteReportId: dialogs.deleteReportId,
    deleteReportName: dialogs.deleteReportName,
    editInitialValues: dialogs.editInitialValues,
    handleCreate: crud.handleCreate,
    handleEdit: crud.handleEdit,
    handleDelete: crud.handleDelete,
    openEditDialog: dialogs.openEditDialog,
    openDeleteDialog: dialogs.openDeleteDialog,
    createLoading: crud.createLoading,
    editLoading: crud.editLoading,
  }
}
