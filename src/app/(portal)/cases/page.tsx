'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, FolderOpen, History } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  CaseToolbar,
  CaseKanbanBoard,
  CaseListTable,
  CreateCaseDialog,
  CycleSelector,
  CaseOwnerFilter,
} from '@/components/cases'
import { PageHeader, LoadingSpinner, EmptyState } from '@/components/common'
import { Button } from '@/components/ui/button'
import { CaseViewMode } from '@/enums'
import { useTenantMembers } from '@/hooks/useCases'
import { useCasesPage } from '@/hooks/useCasesPage'

export default function CasesPage() {
  const t = useTranslations('cases')
  const router = useRouter()

  const {
    viewMode,
    setViewMode,
    severityFilter,
    setSeverityFilter,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    createDialogOpen,
    setCreateDialogOpen,
    isLoading,
    filteredCases,
    createCasePending,
    handleCaseClick,
    handleCreateCase,
    handleCaseSort,
    currentUserId,
    isAdmin,
    selectedCycleId,
    setSelectedCycleId,
    activeCycleId,
    cycles,
    cyclesFetching,
    ownerFilter,
    setOwnerFilter,
  } = useCasesPage()

  const { data: membersData } = useTenantMembers()

  const assigneeOptions = useMemo(
    () =>
      (membersData?.data ?? []).map(m => ({
        label: `${m.name} (${m.email})`,
        value: m.id,
      })),
    [membersData]
  )

  function renderCaseContent() {
    if (isLoading) return <LoadingSpinner />
    if (filteredCases.length === 0) {
      return (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title={t('noCases')}
          description={t('emptyDescription')}
        />
      )
    }
    if (viewMode === CaseViewMode.BOARD) {
      return (
        <CaseKanbanBoard
          cases={filteredCases}
          onCaseClick={handleCaseClick}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
        />
      )
    }
    return (
      <CaseListTable
        cases={filteredCases}
        onCaseClick={handleCaseClick}
        loading={isLoading}
        sortBy={sortField}
        sortOrder={sortOrder}
        onSort={handleCaseSort}
        currentUserId={currentUserId}
        isAdmin={isAdmin}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        description={t('description')}
        action={{
          label: t('createCase'),
          icon: <Plus className="h-4 w-4" />,
          onClick: () => setCreateDialogOpen(true),
        }}
      />

      <div className="flex flex-wrap items-center gap-3">
        <CycleSelector
          cycles={cycles}
          activeCycleId={activeCycleId}
          selectedCycleId={selectedCycleId}
          onCycleChange={setSelectedCycleId}
          loading={cyclesFetching}
        />
        <div className="border-border h-6 border-s" />
        <CaseOwnerFilter
          members={membersData?.data ?? []}
          selectedUserId={ownerFilter}
          onUserSelect={setOwnerFilter}
          currentUserId={currentUserId}
        />
        <div className="ms-auto">
          <Button variant="outline" size="sm" onClick={() => router.push('/cases/cycles')}>
            <History className="me-2 h-4 w-4" />
            {t('cycleHistory')}
          </Button>
        </div>
      </div>

      <CaseToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeSeverityFilter={severityFilter}
        onSeverityFilterChange={setSeverityFilter}
        sortField={sortField}
        onSortFieldChange={setSortField}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      {renderCaseContent()}

      <CreateCaseDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateCase}
        assigneeOptions={assigneeOptions}
        loading={createCasePending}
      />
    </div>
  )
}
