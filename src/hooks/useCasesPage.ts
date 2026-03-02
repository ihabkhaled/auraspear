import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { CreateCaseFormValues } from '@/components/cases'
import { Toast } from '@/components/common'
import { CaseViewMode, CaseSortField } from '@/enums'
import type { CaseSeverity } from '@/enums'
import type { Case } from '@/types'
import { useCases, useCreateCase } from './useCases'

export function useCasesPage() {
  const t = useTranslations('cases')
  const router = useRouter()

  const [viewMode, setViewMode] = useState(CaseViewMode.BOARD)
  const [severityFilter, setSeverityFilter] = useState<CaseSeverity | undefined>()
  const [sortField, setSortField] = useState(CaseSortField.UPDATED)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const { data, isLoading } = useCases(
    severityFilter === undefined
      ? { sortBy: sortField }
      : { severity: severityFilter, sortBy: sortField }
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

  return {
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
    createCasePending: createCase.isPending,
    handleCaseClick,
    handleCreateCase,
  }
}
