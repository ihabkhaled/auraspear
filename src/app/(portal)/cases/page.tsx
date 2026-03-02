'use client'

import { Plus, FolderOpen } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CaseToolbar, CaseKanbanBoard, CaseListTable, CreateCaseDialog } from '@/components/cases'
import { PageHeader, LoadingSpinner, EmptyState } from '@/components/common'
import { CaseViewMode } from '@/enums'
import { useCasesPage } from '@/hooks/useCasesPage'
import { ASSIGNEE_OPTIONS } from '@/lib/constants/cases'

export default function CasesPage() {
  const t = useTranslations('cases')

  const {
    viewMode,
    setViewMode,
    severityFilter,
    setSeverityFilter,
    sortField,
    setSortField,
    createDialogOpen,
    setCreateDialogOpen,
    isLoading,
    filteredCases,
    createCasePending,
    handleCaseClick,
    handleCreateCase,
  } = useCasesPage()

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
      return <CaseKanbanBoard cases={filteredCases} onCaseClick={handleCaseClick} />
    }
    return <CaseListTable cases={filteredCases} onCaseClick={handleCaseClick} loading={isLoading} />
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

      <CaseToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeSeverityFilter={severityFilter}
        onSeverityFilterChange={setSeverityFilter}
        sortField={sortField}
        onSortFieldChange={setSortField}
      />

      {renderCaseContent()}

      <CreateCaseDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateCase}
        assigneeOptions={ASSIGNEE_OPTIONS}
        loading={createCasePending}
      />
    </div>
  )
}
