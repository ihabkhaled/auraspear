import { useTranslations } from 'next-intl'
import type { IncidentStats } from '@/types'

function formatAvgResolve(hours: number | null | undefined): string {
  if (hours === null || hours === undefined) {
    return '-'
  }
  return `${Math.round(hours)}h`
}

export function useIncidentKpiCards(stats: IncidentStats | undefined) {
  const t = useTranslations('incidents')

  const avgResolveDisplay = formatAvgResolve(stats?.avgResolveHours)

  return {
    t,
    open: stats?.open ?? 0,
    inProgress: stats?.inProgress ?? 0,
    contained: stats?.contained ?? 0,
    resolved30d: stats?.resolved30d ?? 0,
    avgResolveDisplay,
  }
}
