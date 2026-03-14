'use client'

import { Shield, BarChart3 } from 'lucide-react'
import { AlertTrendChart } from '@/components/charts'
import { PageHeader, KPICard, LoadingSpinner, EmptyState } from '@/components/common'
import {
  DashboardCard,
  MITRETopTechniques,
  TopTargetedAssets,
  PipelineHealthBar,
} from '@/components/dashboard'
import { useDashboardPage } from '@/hooks/useDashboardPage'
import { KPI_ICONS, KPI_COLORS, KPI_ROUTES } from '@/lib/constants/dashboard'

export default function DashboardPage() {
  const {
    t,
    kpis,
    kpisLoading,
    trends,
    trendsLoading,
    mitre,
    mitreLoading,
    assets,
    assetsLoading,
    healthLoading,
    healthServices,
    healthPercent,
    handleServiceClick,
    router,
  } = useDashboardPage()

  function renderKPIs() {
    if (kpisLoading) return <LoadingSpinner />
    if ((kpis?.data?.length ?? 0) === 0) {
      return (
        <div className="col-span-full">
          <EmptyState
            icon={<BarChart3 className="h-6 w-6" />}
            title={t('emptyTitle')}
            description={t('emptyDescription')}
          />
        </div>
      )
    }
    return kpis?.data?.map((kpi, i) => {
      const route = KPI_ROUTES[kpi.label]
      return (
        <KPICard
          key={kpi.label}
          label={t(kpi.label)}
          value={kpi.value}
          trend={kpi.trend}
          trendLabel={t(kpi.trendLabel)}
          icon={KPI_ICONS[i] ?? KPI_ICONS[0] ?? <Shield className="h-5 w-5" />}
          accentColor={KPI_COLORS[i]}
          onClick={route ? () => router.push(route) : undefined}
        />
      )
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />

      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">{renderKPIs()}</div>

      {/* Alert Trend Chart */}
      <DashboardCard
        title={t('alertTrends')}
        action={<span className="text-muted-foreground text-xs">{t('last7Days')}</span>}
      >
        {trendsLoading ? <LoadingSpinner /> : <AlertTrendChart data={trends?.data ?? []} />}
      </DashboardCard>

      {/* Two column: MITRE + Assets */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardCard title={t('mitreTopTechniques')}>
          {mitreLoading ? (
            <LoadingSpinner />
          ) : (
            <MITRETopTechniques techniques={mitre?.data ?? []} />
          )}
        </DashboardCard>
        <DashboardCard title={t('topTargetedAssets')}>
          {assetsLoading ? <LoadingSpinner /> : <TopTargetedAssets assets={assets?.data ?? []} />}
        </DashboardCard>
      </div>

      {/* Pipeline Health */}
      <DashboardCard
        title={t('pipelineHealth')}
        action={
          <span className="text-muted-foreground text-xs">
            {t('systemHealth')}: {healthPercent}%
          </span>
        }
      >
        {healthLoading ? (
          <LoadingSpinner />
        ) : (
          <PipelineHealthBar services={healthServices} onServiceClick={handleServiceClick} />
        )}
      </DashboardCard>
    </div>
  )
}
