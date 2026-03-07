'use client'

import { Shield, AlertTriangle, Briefcase, Clock, BarChart3 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { AlertTrendChart } from '@/components/charts'
import { PageHeader, KPICard, LoadingSpinner, EmptyState } from '@/components/common'
import {
  DashboardCard,
  MITRETopTechniques,
  TopTargetedAssets,
  PipelineHealthBar,
} from '@/components/dashboard'
import { useKPIs, useAlertTrends, useMITREStats, useAssetRisks, usePipelineHealth } from '@/hooks'

const KPI_ICONS = [
  <Shield key="shield" className="h-5 w-5" />,
  <AlertTriangle key="alert" className="h-5 w-5" />,
  <Briefcase key="briefcase" className="h-5 w-5" />,
  <Clock key="clock" className="h-5 w-5" />,
]

const KPI_COLORS = [
  'var(--primary)',
  'var(--severity-critical)',
  'var(--status-info)',
  'var(--status-success)',
]

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const { data: kpis, isLoading: kpisLoading } = useKPIs()
  const { data: trends, isLoading: trendsLoading } = useAlertTrends()
  const { data: mitre, isLoading: mitreLoading } = useMITREStats()
  const { data: assets, isLoading: assetsLoading } = useAssetRisks()
  const { data: pipeline, isLoading: pipelineLoading } = usePipelineHealth()

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
    return kpis?.data?.map((kpi, i) => (
      <KPICard
        key={kpi.label}
        label={t(kpi.label)}
        value={kpi.value}
        trend={kpi.trend}
        trendLabel={t(kpi.trendLabel)}
        icon={KPI_ICONS[i] ?? KPI_ICONS[0] ?? <Shield className="h-5 w-5" />}
        accentColor={KPI_COLORS[i]}
      />
    ))
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
      <DashboardCard title={t('pipelineHealth')}>
        {pipelineLoading ? (
          <LoadingSpinner />
        ) : (
          <PipelineHealthBar services={pipeline?.data ?? []} />
        )}
      </DashboardCard>
    </div>
  )
}
