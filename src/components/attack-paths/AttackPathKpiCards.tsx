'use client'

import { AlertTriangle, Network, Shield, Target } from 'lucide-react'
import { KPICard } from '@/components/common'
import type { AttackPathKpiCardsProps } from '@/types'

export function AttackPathKpiCards({ stats, t }: AttackPathKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <KPICard
        label={t('kpiActivePaths')}
        value={stats?.activePaths ?? 0}
        icon={<Network className="h-5 w-5" />}
        accentColor="var(--status-error)"
      />
      <KPICard
        label={t('kpiAssetsAtRisk')}
        value={stats?.assetsAtRisk ?? 0}
        icon={<Target className="h-5 w-5" />}
        accentColor="var(--status-warning)"
      />
      <KPICard
        label={t('kpiKillChainCoverage')}
        value={`${stats?.killChainCoverage ?? 0}%`}
        icon={<Shield className="h-5 w-5" />}
        accentColor="var(--primary)"
      />
      <KPICard
        label={t('kpiCriticalPaths')}
        value={stats?.criticalPaths ?? 0}
        icon={<AlertTriangle className="h-5 w-5" />}
        accentColor="var(--severity-critical)"
      />
    </div>
  )
}
