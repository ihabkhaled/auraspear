'use client'

import { Shield, BarChart3 } from 'lucide-react'
import { AlertTrendChart } from '@/components/charts'
import { PageHeader, KPICard, LoadingSpinner, EmptyState } from '@/components/common'
import {
  DashboardCard,
  MITRETopTechniques,
  TopTargetedAssets,
  PipelineHealthBar,
  RecentActivityFeed,
} from '@/components/dashboard'
import { Card, CardContent } from '@/components/ui/card'
import { useDashboardPage } from '@/hooks/useDashboardPage'
import {
  KPI_ICONS,
  KPI_COLORS,
  KPI_ROUTES,
  EXTENDED_KPI_ICONS,
  EXTENDED_KPI_COLORS,
} from '@/lib/constants/dashboard'

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
    extendedKPIItems,
    extendedKPIsLoading,
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

  function renderExtendedKPIs() {
    if (extendedKPIsLoading) return <LoadingSpinner />
    if (extendedKPIItems.length === 0) return null

    return extendedKPIItems.map((item, i) => {
      const icon = EXTENDED_KPI_ICONS[i] ?? EXTENDED_KPI_ICONS[0]
      const color = EXTENDED_KPI_COLORS[i]
      return (
        <Card
          key={item.labelKey}
          className="hover:bg-muted/50 cursor-pointer transition-colors"
          onClick={() => router.push(item.route)}
        >
          <CardContent className="flex items-center gap-3 py-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{
                backgroundColor: color
                  ? `color-mix(in srgb, ${color} 12%, transparent)`
                  : undefined,
                color,
              }}
            >
              {icon}
            </div>
            <div className="min-w-0">
              <p className="text-muted-foreground truncate text-xs">{t(item.labelKey)}</p>
              <p className="text-lg font-bold tracking-tight">{item.value}</p>
            </div>
          </CardContent>
        </Card>
      )
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />

      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">{renderKPIs()}</div>

      {/* Extended KPI Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {renderExtendedKPIs()}
      </div>

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

      {/* Recent Activity + Pipeline Health */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardCard title={t('recentActivity')}>
          <RecentActivityFeed />
        </DashboardCard>

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
    </div>
  )
}
