'use client'

import { Filter, ShieldAlert } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  KQLSearchBar,
  AlertFilterSidebar,
  AlertDetailDrawer,
  AIInvestigationModal,
} from '@/components/alerts'
import { PageHeader, DataTable, Pagination, LoadingSpinner } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useAlertsPage } from '@/hooks/useAlertsPage'

export default function AlertsPage() {
  const t = useTranslations('alerts')

  const {
    selectedSeverities,
    setSeverity,
    timeRange,
    setTimeRange,
    kqlQuery,
    setKqlQuery,
    agentFilter,
    setAgentFilter,
    ruleGroup,
    setRuleGroup,
    selectedAlert,
    drawerOpen,
    setDrawerOpen,
    investigation,
    investigationOpen,
    setInvestigationOpen,
    isLoading,
    data,
    pagination,
    severityCounts,
    columns,
    handleRowClick,
    handleInvestigate,
    handleSearchSubmit,
  } = useAlertsPage()

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
