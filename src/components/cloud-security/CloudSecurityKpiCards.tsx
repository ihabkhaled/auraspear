'use client'

import { AlertTriangle, Cloud, Link2, ShieldAlert } from 'lucide-react'
import { KPICard } from '@/components/common'
import { useCloudSecurityKpiCards } from '@/hooks/useCloudSecurityKpiCards'
import type { CloudSecurityKpiCardsProps } from '@/types'

export function CloudSecurityKpiCards({ stats }: CloudSecurityKpiCardsProps) {
  const { t } = useCloudSecurityKpiCards()

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <KPICard
        label={t('kpiAccounts')}
        value={stats?.totalAccounts ?? 0}
        icon={<Cloud className="h-5 w-5" />}
        accentColor="var(--primary)"
      />
      <KPICard
        label={t('kpiOpenFindings')}
        value={stats?.openFindings ?? 0}
        icon={<ShieldAlert className="h-5 w-5" />}
        accentColor="var(--status-error)"
      />
      <KPICard
        label={t('kpiCriticalFindings')}
        value={stats?.criticalFindings ?? 0}
        icon={<AlertTriangle className="h-5 w-5" />}
        accentColor="var(--severity-critical)"
      />
      <KPICard
        label={t('kpiConnected')}
        value={stats?.connected ?? 0}
        icon={<Link2 className="h-5 w-5" />}
        accentColor="var(--status-success)"
      />
    </div>
  )
}
