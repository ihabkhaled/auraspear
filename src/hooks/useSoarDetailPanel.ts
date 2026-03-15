import { useTranslations } from 'next-intl'
import type { SoarDetailPanelProps } from '@/types'

export function useSoarDetailPanel({ playbook }: Pick<SoarDetailPanelProps, 'playbook'>) {
  const t = useTranslations('soar')

  const avgDurationDisplay =
    playbook?.avgDurationSeconds !== null && playbook?.avgDurationSeconds !== undefined
      ? `${Math.round(playbook.avgDurationSeconds)}s`
      : '-'

  return {
    t,
    avgDurationDisplay,
  }
}
