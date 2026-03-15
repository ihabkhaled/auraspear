'use client'

import { GitBranch, Link, ShieldCheck, Zap } from 'lucide-react'
import { KPICard } from '@/components/common'
import { useCorrelationKpiCards } from '@/hooks/useCorrelationKpiCards'
import type { CorrelationKpiCardsProps } from '@/types'

export function CorrelationKpiCards({ stats }: CorrelationKpiCardsProps) {
  const { t } = useCorrelationKpiCards({ stats })

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KPICard
        label={t('kpiCorrelationRules')}
        value={stats?.correlationRules ?? 0}
        icon={<GitBranch className="h-5 w-5" />}
        accentColor="#6366f1"
      />
      <KPICard
        label={t('kpiSigmaRules')}
        value={stats?.sigmaRules ?? 0}
        icon={<ShieldCheck className="h-5 w-5" />}
        accentColor="#8b5cf6"
      />
      <KPICard
        label={t('kpiFired24h')}
        value={stats?.fired24h ?? 0}
        icon={<Zap className="h-5 w-5" />}
        accentColor="#f59e0b"
      />
      <KPICard
        label={t('kpiLinkedToIncidents')}
        value={stats?.linkedToIncidents ?? 0}
        icon={<Link className="h-5 w-5" />}
        accentColor="#3b82f6"
      />
    </div>
  )
}
