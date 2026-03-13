'use client'

import { use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CycleBadge } from '@/components/cases'
import { LoadingSpinner, Toast, SweetAlertDialog, SweetAlertIcon } from '@/components/common'
import { DataTable } from '@/components/common/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CaseCycleStatus, UserRole } from '@/enums'
import { useCaseCycle, useCloseCaseCycle } from '@/hooks/useCaseCycles'
import { getErrorKey } from '@/lib/api-error'
import { hasRole } from '@/lib/roles'
import { formatDate } from '@/lib/utils'
import { useAuthStore } from '@/stores'
import type { Case, Column } from '@/types'

export default function CycleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const t = useTranslations('cases.cycles')
  const tCases = useTranslations('cases')
  const tErrors = useTranslations()
  const router = useRouter()
  const user = useAuthStore(s => s.user)

  const currentUserRole = user?.role ?? UserRole.SOC_ANALYST_L1
  const isAdmin = hasRole(currentUserRole, UserRole.TENANT_ADMIN)

  const { data: cycleData, isLoading } = useCaseCycle(id)
  const closeCycle = useCloseCaseCycle()

  const cycle = cycleData?.data

  const handleCloseCycle = useCallback(async () => {
    if (!cycle) {
      return
    }
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
        onSuccess: () => Toast.success(t('cycleClosed')),
        onError: (error: unknown) => Toast.error(tErrors(getErrorKey(error))),
      }
    )
  }, [cycle, closeCycle, t, tErrors])

  const handleCaseClick = useCallback(
    (caseItem: Case) => {
      router.push(`/cases/${caseItem.id}`)
    },
    [router]
  )

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!cycle) {
    return <div className="text-muted-foreground p-8 text-center">{t('notFound')}</div>
  }

  const columns: Column<Case>[] = [
    { key: 'caseNumber', label: tCases('caseNumber') },
    { key: 'title', label: tCases('caseTitle') },
    {
      key: 'severity',
      label: tCases('severity'),
      render: (value: unknown) => <Badge variant="outline">{String(value)}</Badge>,
    },
    {
      key: 'status',
      label: tCases('status'),
      render: (value: unknown) => <Badge variant="secondary">{String(value)}</Badge>,
    },
    {
      key: 'ownerName',
      label: tCases('assignee'),
      render: (value: unknown) => (value as string | null) ?? '—',
    },
    {
      key: 'createdAt',
      label: tCases('createdAt'),
      render: (value: unknown) => formatDate(value as string),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/cases/cycles')}>
          <ArrowLeft className="me-2 h-4 w-4" />
          {t('backToHistory')}
        </Button>
      </div>

      <div className="bg-card border-border rounded-lg border p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{cycle.name}</h1>
              <CycleBadge status={cycle.status as CaseCycleStatus} />
            </div>
            {cycle.description && <p className="text-muted-foreground">{cycle.description}</p>}
          </div>
          {isAdmin && cycle.status === CaseCycleStatus.ACTIVE && (
            <Button variant="outline" onClick={handleCloseCycle} disabled={closeCycle.isPending}>
              <Lock className="me-2 h-4 w-4" />
              {t('closeCycle')}
            </Button>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-muted-foreground text-sm">{t('startDate')}</p>
            <p className="font-medium">{formatDate(cycle.startDate)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">{t('endDate')}</p>
            <p className="font-medium">{cycle.endDate ? formatDate(cycle.endDate) : '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">{t('caseCount')}</p>
            <p className="font-medium">{cycle.caseCount}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">{t('openCount')}</p>
            <p className="font-medium">{cycle.openCount}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">{t('cycleCases')}</h2>
        <DataTable
          columns={columns}
          data={cycle.cases as Case[]}
          emptyMessage={t('noCasesInCycle')}
          onRowClick={handleCaseClick}
        />
      </div>
    </div>
  )
}
