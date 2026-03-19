'use client'

import { Shield, BarChart3 } from 'lucide-react'
import { AlertTrendChart } from '@/components/charts'
import { PageHeader, KpiCard, LoadingSpinner, EmptyState } from '@/components/common'
import {
  DashboardSectionCard,
  MitreTopTechniques,
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
import { getDashboardCardGridClass } from '@/lib/dashboard.utils'
import { cn } from '@/lib/utils'

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
    canAccessRoute,
    canViewAlertAnalytics,
    canViewPipelineHealth,
    navigateToRoute,
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
      const route = Reflect.get(KPI_ROUTES, kpi.label) as string | undefined
      if (route && !canAccessRoute(route)) {
        return null
      }
      return (
        <KpiCard
          key={kpi.label}
          label={t(kpi.label)}
          value={kpi.value}
          trend={kpi.trend}
          trendLabel={t(kpi.trendLabel)}
          icon={KPI_ICONS.at(i) ?? KPI_ICONS.at(0) ?? <Shield className="h-5 w-5" />}
          accentColor={KPI_COLORS.at(i)}
          onClick={route ? () => navigateToRoute(route) : undefined}
        />
      )
    })
  }

  function renderExtendedKPIs() {
    if (extendedKPIsLoading) return <LoadingSpinner />
    if (!extendedKPIItems.some(item => canAccessRoute(item.route))) return null

    return extendedKPIItems.map((item, i) => {
      if (!canAccessRoute(item.route)) {
        return null
      }
      const icon = EXTENDED_KPI_ICONS.at(i) ?? EXTENDED_KPI_ICONS.at(0)
      const color = EXTENDED_KPI_COLORS.at(i)
      return (
        <Card
          key={item.labelKey}
          className="hover:bg-muted/50 cursor-pointer transition-colors"
          onClick={() => navigateToRoute(item.route)}
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

  const visibleKpiCount =
    kpis?.data?.filter(kpi => {
      const route = Reflect.get(KPI_ROUTES, kpi.label) as string | undefined
      return !route || canAccessRoute(route)
    }).length ?? 0

  const visibleExtendedKpiCount = extendedKPIItems.filter(item => canAccessRoute(item.route)).length

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />

      <div className={cn('grid gap-4', getDashboardCardGridClass(visibleKpiCount))}>
        {renderKPIs()}
      </div>

      {visibleExtendedKpiCount > 0 ? (
        <div className={cn('grid gap-3', getDashboardCardGridClass(visibleExtendedKpiCount))}>
          {renderExtendedKPIs()}
        </div>
      ) : null}

      {canViewAlertAnalytics ? (
        <DashboardSectionCard
          title={t('alertTrends')}
          action={<span className="text-muted-foreground text-xs">{t('last7Days')}</span>}
        >
          {trendsLoading ? <LoadingSpinner /> : <AlertTrendChart data={trends?.data ?? []} />}
        </DashboardSectionCard>
      ) : null}

      {canViewAlertAnalytics ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DashboardSectionCard title={t('mitreTopTechniques')}>
            {mitreLoading ? (
              <LoadingSpinner />
            ) : (
              <MitreTopTechniques techniques={mitre?.data ?? []} />
            )}
          </DashboardSectionCard>
          <DashboardSectionCard title={t('topTargetedAssets')}>
            {assetsLoading ? <LoadingSpinner /> : <TopTargetedAssets assets={assets?.data ?? []} />}
          </DashboardSectionCard>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardSectionCard title={t('recentActivity')}>
          <RecentActivityFeed />
        </DashboardSectionCard>

        {canViewPipelineHealth ? (
          <DashboardSectionCard
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
          </DashboardSectionCard>
        ) : null}
      </div>
    </div>
  )
}
