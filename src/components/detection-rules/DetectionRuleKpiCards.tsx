'use client'

import { AlertTriangle, CheckCircle2, FlaskConical, ShieldCheck } from 'lucide-react'
import { KPICard } from '@/components/common'
import { useDetectionRuleKpiCards } from '@/hooks/useDetectionRuleKpiCards'
import type { DetectionRuleKpiCardsProps } from '@/types'

export function DetectionRuleKpiCards({ stats }: DetectionRuleKpiCardsProps) {
  const { t, fpRateDisplay } = useDetectionRuleKpiCards({ stats })

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <KPICard
        label={t('kpiTotal')}
        value={stats?.totalRules ?? 0}
        icon={<ShieldCheck className="h-5 w-5" />}
        accentColor="var(--primary)"
      />
      <KPICard
        label={t('kpiEnabled')}
        value={stats?.enabled ?? 0}
        icon={<CheckCircle2 className="h-5 w-5" />}
        accentColor="var(--status-success)"
      />
      <KPICard
        label={t('kpiMatches30d')}
        value={stats?.totalMatches30d ?? 0}
        icon={<FlaskConical className="h-5 w-5" />}
        accentColor="var(--status-info)"
      />
      <KPICard
        label={t('kpiFpRate')}
        value={fpRateDisplay}
        icon={<AlertTriangle className="h-5 w-5" />}
        accentColor="var(--status-warning)"
      />
    </div>
  )
}
