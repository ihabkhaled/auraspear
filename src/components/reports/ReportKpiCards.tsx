'use client'

import { AlertTriangle, CheckCircle2, Clock, FileText } from 'lucide-react'
import { KPICard } from '@/components/common'
import { useReportKpiCards } from '@/hooks/useReportKpiCards'
import type { ReportKpiCardsProps } from '@/types'

export function ReportKpiCards({ stats }: ReportKpiCardsProps) {
  const { t } = useReportKpiCards({ stats })

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <KPICard
        label={t('kpiTotal')}
        value={stats?.totalReports ?? 0}
        icon={<FileText className="h-5 w-5" />}
        accentColor="var(--primary)"
      />
      <KPICard
        label={t('kpiGenerated30d')}
        value={stats?.generated30d ?? 0}
        icon={<CheckCircle2 className="h-5 w-5" />}
        accentColor="var(--status-success)"
      />
      <KPICard
        label={t('kpiPending')}
        value={stats?.pendingReports ?? 0}
        icon={<Clock className="h-5 w-5" />}
        accentColor="var(--status-warning)"
      />
      <KPICard
        label={t('kpiFailed')}
        value={stats?.failedReports ?? 0}
        icon={<AlertTriangle className="h-5 w-5" />}
        accentColor="var(--status-error)"
      />
    </div>
  )
}
