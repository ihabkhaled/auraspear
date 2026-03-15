'use client'

import { CheckCircle2, Clock, Play, Workflow, Zap } from 'lucide-react'
import { KPICard } from '@/components/common'
import { useSoarKpiCards } from '@/hooks/useSoarKpiCards'
import type { SoarKpiCardsProps } from '@/types'

export function SoarKpiCards({ stats }: SoarKpiCardsProps) {
  const { t, avgDurationDisplay, successRateDisplay } = useSoarKpiCards({ stats })

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <KPICard
        label={t('kpiTotal')}
        value={stats?.totalPlaybooks ?? 0}
        icon={<Workflow className="h-5 w-5" />}
        accentColor="var(--primary)"
      />
      <KPICard
        label={t('kpiActive')}
        value={stats?.activePlaybooks ?? 0}
        icon={<Zap className="h-5 w-5" />}
        accentColor="var(--status-success)"
      />
      <KPICard
        label={t('kpiExecutions30d')}
        value={stats?.totalExecutions30d ?? 0}
        icon={<Play className="h-5 w-5" />}
        accentColor="var(--status-info)"
      />
      <KPICard
        label={t('kpiSuccessRate')}
        value={successRateDisplay}
        icon={<CheckCircle2 className="h-5 w-5" />}
        accentColor="var(--status-success)"
      />
      <KPICard
        label={t('kpiAvgDuration')}
        value={avgDurationDisplay}
        icon={<Clock className="h-5 w-5" />}
        accentColor={undefined}
      />
    </div>
  )
}
