'use client'

import { useIncidentPageCrud } from './useIncidentPageCrud'
import { useIncidentPageDialogs } from './useIncidentPageDialogs'
import { useIncidentPageFilters } from './useIncidentPageFilters'

export function useIncidentsPage() {
  const filters = useIncidentPageFilters()
  const dialogs = useIncidentPageDialogs()
  const crud = useIncidentPageCrud(dialogs)

  return {
    t: filters.t,
    tCommon: filters.tCommon,
    data: filters.data,
    stats: filters.stats,
    statsLoading: filters.statsLoading,
    columns: filters.columns,
    isLoading: filters.isLoading,
    isFetching: filters.isFetching,
    pagination: filters.pagination,
    searchQuery: filters.searchQuery,
    statusFilter: filters.statusFilter,
    severityFilter: filters.severityFilter,
    categoryFilter: filters.categoryFilter,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    assigneeOptions: filters.assigneeOptions,
    handleSearchChange: filters.handleSearchChange,
    handleStatusChange: filters.handleStatusChange,
    handleSeverityChange: filters.handleSeverityChange,
    handleCategoryChange: filters.handleCategoryChange,
    handleClearAllFilters: filters.handleClearAllFilters,
    handleSort: filters.handleSort,
    createDialogOpen: dialogs.createDialogOpen,
    setCreateDialogOpen: dialogs.setCreateDialogOpen,
    editDialogOpen: dialogs.editDialogOpen,
    setEditDialogOpen: dialogs.setEditDialogOpen,
    detailPanelOpen: dialogs.detailPanelOpen,
    setDetailPanelOpen: dialogs.setDetailPanelOpen,
    editingIncident: dialogs.editingIncident,
    detailIncident: dialogs.detailIncident,
    setDetailIncident: dialogs.setDetailIncident,
    editInitialValues: dialogs.editInitialValues,
    handleRowClick: dialogs.handleRowClick,
    handleOpenEdit: dialogs.handleOpenEdit,
    handleCreate: crud.handleCreate,
    handleEdit: crud.handleEdit,
    handleDelete: crud.handleDelete,
    handleCopyId: crud.handleCopyId,
    createLoading: crud.createLoading,
    editLoading: crud.editLoading,
    deleteLoading: crud.deleteLoading,
  }
}
