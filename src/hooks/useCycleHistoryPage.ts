import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { CreateCycleFormValues } from '@/components/cases'
import { Toast, SweetAlertDialog, SweetAlertIcon } from '@/components/common'
import { SortOrder, UserRole } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { hasRole } from '@/lib/roles'
import { useAuthStore } from '@/stores'
import type { CaseCycle } from '@/types'
import { useCaseCycles, useCreateCaseCycle, useCloseCaseCycle } from './useCaseCycles'
import { usePagination } from './usePagination'

export function useCycleHistoryPage() {
  const t = useTranslations('cases.cycles')
  const tErrors = useTranslations()
  const router = useRouter()
  const user = useAuthStore(s => s.user)

  const currentUserRole = user?.role ?? UserRole.SOC_ANALYST_L1
  const isAdmin = hasRole(currentUserRole, UserRole.TENANT_ADMIN)

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [sortBy, setSortBy] = useState<string | undefined>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder | undefined>(SortOrder.DESC)
  const pagination = usePagination({ initialLimit: 10 })

  const {
    data: cyclesData,
    isLoading,
    isFetching,
  } = useCaseCycles({
    page: pagination.page,
    limit: pagination.limit,
    ...(sortBy ? { sortBy } : {}),
    ...(sortOrder ? { sortOrder } : {}),
  })

  useEffect(() => {
    if (cyclesData?.pagination) {
      pagination.setTotal(cyclesData.pagination.total)
    }
  }, [cyclesData?.pagination, pagination])

  const createCycle = useCreateCaseCycle()
  const closeCycle = useCloseCaseCycle()

  const handleSort = useCallback(
    (key: string, order: SortOrder) => {
      setSortBy(key)
      setSortOrder(order)
      pagination.setPage(1)
    },
    [pagination]
  )

  const handleCycleClick = useCallback(
    (cycle: CaseCycle) => {
      router.push(`/cases/cycles/${cycle.id}`)
    },
    [router]
  )

  const handleCreateCycle = useCallback(
    (formData: CreateCycleFormValues) => {
      createCycle.mutate(
        {
          name: formData.name,
          ...(formData.description.length > 0 ? { description: formData.description } : {}),
          startDate: formData.startDate,
          ...(formData.endDate.length > 0 ? { endDate: formData.endDate } : {}),
        },
        {
          onSuccess: () => {
            setCreateDialogOpen(false)
            Toast.success(t('cycleCreated'))
          },
          onError: (error: unknown) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [createCycle, t, tErrors]
  )

  const handleCloseCycle = useCallback(
    async (cycle: CaseCycle) => {
      const confirmed = await SweetAlertDialog.show({
        title: t('closeCycle'),
        text: t('confirmCloseCycle'),
        icon: SweetAlertIcon.WARNING,
      })

      if (!confirmed) {
        return
      }

      closeCycle.mutate(
        { id: cycle.id, data: {} },
        {
          onSuccess: () => {
            Toast.success(t('cycleClosed'))
          },
          onError: (error: unknown) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [closeCycle, t, tErrors]
  )

  return {
    isAdmin,
    cycles: cyclesData?.data ?? [],
    isLoading,
    isFetching,
    createDialogOpen,
    setCreateDialogOpen,
    createCyclePending: createCycle.isPending,
    sortBy,
    sortOrder,
    handleSort,
    handleCycleClick,
    handleCreateCycle,
    handleCloseCycle,
    pagination,
  }
}
