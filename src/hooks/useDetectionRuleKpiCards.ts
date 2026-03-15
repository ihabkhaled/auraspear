import { useTranslations } from 'next-intl'
import type { DetectionRuleKpiCardsProps } from '@/types'

export function useDetectionRuleKpiCards({ stats }: Pick<DetectionRuleKpiCardsProps, 'stats'>) {
  const t = useTranslations('detectionRules')

  const fpRateDisplay =
    stats?.avgFalsePositiveRate !== null && stats?.avgFalsePositiveRate !== undefined
      ? `${stats.avgFalsePositiveRate.toFixed(1)}%`
      : '-'

  return { t, fpRateDisplay }
}
