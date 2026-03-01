'use client'

import { useState, useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Plus, FolderOpen } from 'lucide-react'
import { PageHeader, LoadingSpinner, Toast, EmptyState } from '@/components/common'
import {
  CaseToolbar,
  CaseViewMode,
  CaseSortField,
  CaseKanbanBoard,
  CreateCaseDialog,
} from '@/components/cases'
import { useCases, useCreateCase } from '@/hooks'
import type { Case } from '@/types'
import type { CreateCaseFormValues } from '@/components/cases'
import type { CaseSeverity } from '@/enums'

const ASSIGNEE_OPTIONS = [
  { label: 'Ahmed Al-Rashid', value: 'ahmed' },
  { label: 'Fatima Hassan', value: 'fatima' },
  { label: 'Omar Khalil', value: 'omar' },
  { label: 'Sara Nasser', value: 'sara' },
]

export default function CasesPage() {
  const t = useTranslations('cases')
  const router = useRouter()

  const [viewMode, setViewMode] = useState(CaseViewMode.BOARD)
  const [severityFilter, setSeverityFilter] = useState<CaseSeverity | undefined>(undefined)
  const [sortField, setSortField] = useState(CaseSortField.UPDATED)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const { data, isLoading } = useCases(
    severityFilter !== undefined
      ? { severity: severityFilter, sortBy: sortField }
      : { sortBy: sortField }
  )

  const createCase = useCreateCase()

  const filteredCases = useMemo(() => {
    const cases = data?.data ?? []
    if (severityFilter === undefined) return cases
    return cases.filter(c => c.severity === severityFilter)
  }, [data?.data, severityFilter])

  const handleCaseClick = useCallback(
    (caseItem: Case) => {
      router.push(`/cases/${caseItem.id}`)
    },
    [router]
  )

  const handleCreateCase = useCallback(
    (formData: CreateCaseFormValues) => {
      createCase.mutate(
        {
          title: formData.title,
          description: formData.description,
          severity: formData.severity,
          assignee: formData.assignee,
        },
        {
          onSuccess: () => {
            setCreateDialogOpen(false)
            Toast.success(t('caseCreated'))
          },
          onError: () => {
            Toast.error(t('caseCreateError'))
          },
        }
      )
    },
    [createCase, t]
  )

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

      {isLoading ? (
        <LoadingSpinner />
      ) : filteredCases.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title={t('noCases')}
          description={t('emptyDescription')}
        />
      ) : (
        <CaseKanbanBoard
          cases={filteredCases}
          onCaseClick={handleCaseClick}
        />
      )}

      <CreateCaseDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateCase}
        assigneeOptions={ASSIGNEE_OPTIONS}
        loading={createCase.isPending}
      />
    </div>
  )
}
