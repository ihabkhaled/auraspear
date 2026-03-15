import { useTranslations } from 'next-intl'
import type { ComplianceDetailPanelProps } from '@/types'
import { useComplianceControls } from './useCompliance'

export function useComplianceDetailPanel({
  framework,
}: Pick<ComplianceDetailPanelProps, 'framework'>) {
  const t = useTranslations('compliance')

  const { data: controlsData, isFetching: controlsLoading } = useComplianceControls(
    framework?.id ?? null
  )

  const controls = controlsData?.data ?? []

  const scoreDisplay =
    framework?.complianceScore !== null && framework?.complianceScore !== undefined
      ? `${Math.round(framework.complianceScore)}%`
      : '-'

  const scorePercent = framework?.complianceScore ?? 0

  return {
    t,
    controls,
    controlsLoading,
    scoreDisplay,
    scorePercent,
  }
}
