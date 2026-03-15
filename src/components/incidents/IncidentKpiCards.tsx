'use client'

import { AlertTriangle, CheckCircle2, Clock, Shield } from 'lucide-react'
import { KPICard } from '@/components/common'
import { Skeleton } from '@/components/ui/skeleton'
import { useIncidentKpiCards } from '@/hooks/useIncidentKpiCards'
import type { IncidentKpiCardsProps } from '@/types'

export function IncidentKpiCards({ stats, isLoading }: IncidentKpiCardsProps) {
  const { t, open, inProgress, contained, resolved30d, avgResolveDisplay } =
    useIncidentKpiCards(stats)

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton key={`kpi-skel-${String(idx)}`} className="h-24 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <KPICard
        label={t('kpiOpen')}
        value={open}
        icon={<AlertTriangle className="h-5 w-5" />}
        accentColor="var(--status-error)"
      />
      <KPICard
        label={t('kpiInProgress')}
        value={inProgress}
        icon={<Clock className="h-5 w-5" />}
        accentColor="var(--primary)"
      />
      <KPICard
        label={t('kpiContained')}
        value={contained}
        icon={<Shield className="h-5 w-5" />}
        accentColor="var(--status-warning)"
      />
      <KPICard
        label={t('kpiResolved30d')}
        value={resolved30d}
        icon={<CheckCircle2 className="h-5 w-5" />}
        accentColor="var(--status-success)"
      />
      <KPICard
        label={t('kpiAvgResolve')}
        value={avgResolveDisplay}
        icon={<Clock className="h-5 w-5" />}
        accentColor={undefined}
      />
    </div>
  )
}
