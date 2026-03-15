import { useTranslations } from 'next-intl'
import { useAttackPathStats } from './useAttackPaths'

export function useAttackPathKpiCards() {
  const t = useTranslations('attackPath')
  const { data: statsData } = useAttackPathStats()

  const stats = statsData?.data ?? null

  return {
    t,
    stats,
  }
}
