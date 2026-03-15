'use client'

import { AlertTriangle, CheckCircle2, Layers, XCircle } from 'lucide-react'
import { KPICard } from '@/components/common'
import { useNormalizationKpiCards } from '@/hooks/useNormalizationKpiCards'
import type { NormalizationKpiCardsProps } from '@/types'

export function NormalizationKpiCards({ stats }: NormalizationKpiCardsProps) {
  const { t, totalProcessedDisplay } = useNormalizationKpiCards({ stats })

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <KPICard
        label={t('kpiTotal')}
        value={stats?.totalPipelines ?? 0}
        icon={<Layers className="h-5 w-5" />}
        accentColor="var(--primary)"
      />
      <KPICard
        label={t('kpiActive')}
        value={stats?.active ?? 0}
        icon={<CheckCircle2 className="h-5 w-5" />}
        accentColor="var(--status-success)"
      />
      <KPICard
        label={t('kpiError')}
        value={stats?.error ?? 0}
        icon={<XCircle className="h-5 w-5" />}
        accentColor="var(--status-error)"
      />
      <KPICard
        label={t('kpiTotalProcessed')}
        value={totalProcessedDisplay}
        icon={<AlertTriangle className="h-5 w-5" />}
        accentColor="var(--status-info)"
      />
    </div>
  )
}
