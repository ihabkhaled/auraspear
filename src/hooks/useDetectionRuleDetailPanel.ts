import { useTranslations } from 'next-intl'
import type { DetectionRuleDetailPanelProps } from '@/types'

export function useDetectionRuleDetailPanel({ rule }: Pick<DetectionRuleDetailPanelProps, 'rule'>) {
  const t = useTranslations('detectionRules')
  const tCommon = useTranslations('common')

  const hasData = rule !== null

  return { t, tCommon, hasData }
}
