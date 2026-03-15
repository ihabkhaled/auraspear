import { useTranslations } from 'next-intl'
import type { NormalizationDetailPanelProps } from '@/types'

export function useNormalizationDetailPanel({
  pipeline,
}: Pick<NormalizationDetailPanelProps, 'pipeline'>) {
  const t = useTranslations('normalization')
  const tCommon = useTranslations('common')

  const hasData = pipeline !== null

  return { t, tCommon, hasData }
}
