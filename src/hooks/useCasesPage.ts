import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { CreateCaseFormValues } from '@/components/cases'
import { Toast } from '@/components/common'
import { CaseViewMode, CaseSortField, SortOrder, UserRole } from '@/enums'
import type { CaseSeverity } from '@/enums'
import { hasRole } from '@/lib/roles'
import { useAuthStore } from '@/stores'
import type { Case } from '@/types'
import { useActiveCycle, useCaseCycles } from './useCaseCycles'
import { useCases, useCreateCase } from './useCases'

export function useCasesPage() {
  const t = useTranslations('cases')
  const router = useRouter()
  const user = useAuthStore(s => s.user)

  const currentUserId = user?.sub ?? ''
  const currentUserRole = user?.role ?? UserRole.SOC_ANALYST_L1
  const isAdmin = hasRole(currentUserRole, UserRole.TENANT_ADMIN)

  const [viewMode, setViewMode] = useState(CaseViewMode.BOARD)
  const [severityFilter, setSeverityFilter] = useState<CaseSeverity | undefined>()
  const [sortField, setSortField] = useState(CaseSortField.UPDATED)
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedCycleId, setSelectedCycleId] = useState<string | undefined>()
  const [ownerFilter, setOwnerFilter] = useState<string | undefined>()

  // Fetch active cycle for default selection
  const { data: activeCycleData } = useActiveCycle()
  const activeCycleId = activeCycleData?.data?.id

  // Fetch all cycles for the selector dropdown
  const { data: cyclesData, isFetching: cyclesFetching } = useCaseCycles({
    limit: 100,
    sortBy: 'createdAt',
    sortOrder: SortOrder.DESC,
  })

  const { data, isLoading } = useCases({
    sortBy: sortField,
    sortOrder,
    ...(severityFilter === undefined ? {} : { severity: severityFilter }),
    ...(selectedCycleId ? { cycleId: selectedCycleId } : {}),
    ...(ownerFilter ? { ownerUserId: ownerFilter } : {}),
  })

  const createCase = useCreateCase()

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
          ...(formData.assignee ? { ownerUserId: formData.assignee } : {}),
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

  const handleCaseSort = useCallback((key: string, order: SortOrder) => {
    setSortField(key as CaseSortField)
    setSortOrder(order)
  }, [])

  return {
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
    filteredCases: data?.data ?? [],
    createCasePending: createCase.isPending,
    handleCaseClick,
    handleCreateCase,
    handleCaseSort,
    currentUserId,
    isAdmin,
    // Cycle-related
    selectedCycleId,
    setSelectedCycleId,
    activeCycleId,
    cycles: cyclesData?.data ?? [],
    cyclesFetching,
    // Owner filter
    ownerFilter,
    setOwnerFilter,
  }
}
