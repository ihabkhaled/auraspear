'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { Filter, ShieldAlert } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  KQLSearchBar,
  AlertFilterSidebar,
  getAlertColumns,
  AlertDetailDrawer,
  AIInvestigationModal,
} from '@/components/alerts'
import { PageHeader, DataTable, Pagination, LoadingSpinner, Toast } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useAlerts, useInvestigateAlert, usePagination, useDebounce } from '@/hooks'
import { SEVERITY_ORDER } from '@/lib/alert.utils'
import { useFilterStore } from '@/stores'
import type { Alert, AIInvestigation, AlertSearchParams } from '@/types'

export default function AlertsPage() {
  const t = useTranslations('alerts')
  const tCommon = useTranslations('common')

  const {
    severity: selectedSeverities,
    setSeverity,
    timeRange,
    setTimeRange,
    kqlQuery,
    setKqlQuery,
  } = useFilterStore()

  const [agentFilter, setAgentFilter] = useState('')
  const [ruleGroup, setRuleGroup] = useState('')
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [investigation, setInvestigation] = useState<AIInvestigation | null>(null)
  const [investigationOpen, setInvestigationOpen] = useState(false)

  const pagination = usePagination({ initialPage: 1, initialLimit: 10 })
  const debouncedQuery = useDebounce(kqlQuery, 400)

  const searchParams: AlertSearchParams = {
    page: pagination.page,
    limit: pagination.limit,
    timeRange,
  }
  if (selectedSeverities.length > 0) {
    searchParams.severity = selectedSeverities
  }
  if (debouncedQuery.length > 0) {
    searchParams.query = debouncedQuery
  }

  const { data, isLoading } = useAlerts(searchParams)

  const investigateMutation = useInvestigateAlert()

  useEffect(() => {
    if (data?.pagination) {
      pagination.setTotal(data.pagination.total)
    }
  }, [data?.pagination, pagination])

  const severityCounts = useMemo(() => {
    return SEVERITY_ORDER.map(sev => ({
      severity: sev,
      count: data?.data?.filter(a => a.severity === sev).length ?? 0,
    }))
  }, [data?.data])

  const handleRowClick = useCallback((alert: Alert) => {
    setSelectedAlert(alert)
    setDrawerOpen(true)
  }, [])

  const handleInvestigate = useCallback(
    (alert: Alert) => {
      investigateMutation.mutate(alert.id, {
        onSuccess: result => {
          setInvestigation(result.data)
          setInvestigationOpen(true)
          setDrawerOpen(false)
        },
        onError: () => {
          Toast.error(t('investigateError'))
        },
      })
    },
    [investigateMutation, t]
  )

  const handleCopyId = useCallback(
    (id: string) => {
      void navigator.clipboard.writeText(id)
      Toast.success(tCommon('copied'))
    },
    [tCommon]
  )

  const handleSearchSubmit = useCallback(() => {
    pagination.setPage(1)
  }, [pagination])

  const columns = useMemo(() => {
    return getAlertColumns(
      { alerts: t, common: tCommon },
      {
        onView: handleRowClick,
        onInvestigate: handleInvestigate,
        onCopyId: handleCopyId,
      }
    )
  }, [t, tCommon, handleRowClick, handleInvestigate, handleCopyId])

  return (
    <div className="space-y-4">
      <PageHeader title={t('title')} description={t('description')} />

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <KQLSearchBar value={kqlQuery} onChange={setKqlQuery} onSubmit={handleSearchSubmit} />
        </div>

        {/* Mobile filter button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="xl:hidden">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">{t('filters')}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{t('filters')}</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <AlertFilterSidebar
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
                selectedSeverities={selectedSeverities}
                onSeverityChange={setSeverity}
                severityCounts={severityCounts}
                agentFilter={agentFilter}
                onAgentFilterChange={setAgentFilter}
                ruleGroup={ruleGroup}
                onRuleGroupChange={setRuleGroup}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-6">
        <div className="hidden xl:block">
          <AlertFilterSidebar
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            selectedSeverities={selectedSeverities}
            onSeverityChange={setSeverity}
            severityCounts={severityCounts}
            agentFilter={agentFilter}
            onAgentFilterChange={setAgentFilter}
            ruleGroup={ruleGroup}
            onRuleGroupChange={setRuleGroup}
          />
        </div>

        <div className="flex flex-1 flex-col gap-4">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <DataTable
              columns={columns}
              data={data?.data ?? []}
              onRowClick={handleRowClick}
              emptyMessage={t('noAlerts')}
              emptyIcon={<ShieldAlert className="h-6 w-6" />}
              emptyDescription={t('emptyDescription')}
            />
          )}

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={pagination.setPage}
            total={pagination.total}
          />
        </div>
      </div>

      <AlertDetailDrawer
        alert={selectedAlert}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onInvestigate={handleInvestigate}
        onClose={() => setDrawerOpen(false)}
      />

      <AIInvestigationModal
        investigation={investigation}
        open={investigationOpen}
        onOpenChange={setInvestigationOpen}
      />
    </div>
  )
}
