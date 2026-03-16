'use client'

import { Activity, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { KpiCard } from '@/components/common'
import { useSystemHealthKpiCards } from '@/hooks/useSystemHealthKpiCards'
import type { SystemHealthKpiCardsProps } from '@/types'

export function SystemHealthKpiCards({ stats }: SystemHealthKpiCardsProps) {
  const { t, avgResponseTime, uptimePercent } = useSystemHealthKpiCards({ stats })

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <KpiCard
        label={t('kpiTotalServices')}
        value={stats?.totalServices ?? 0}
        icon={<Activity className="h-5 w-5" />}
        accentColor="var(--primary)"
      />
      <KpiCard
        label={t('kpiAvgResponseTime')}
        value={avgResponseTime}
        icon={<Clock className="h-5 w-5" />}
        accentColor="var(--status-info)"
      />
      <KpiCard
        label={t('kpiUptimePercent')}
        value={uptimePercent}
        icon={<CheckCircle2 className="h-5 w-5" />}
        accentColor="var(--status-success)"
      />
      <KpiCard
        label={t('kpiDegraded')}
        value={stats?.degraded ?? 0}
        icon={<AlertTriangle className="h-5 w-5" />}
        accentColor="var(--status-warning)"
      />
    </div>
  )
}
