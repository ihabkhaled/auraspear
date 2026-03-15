import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { UebaRiskLevel } from '@/enums'
import type { UebaAnomaly } from '@/types'

const SEVERITY_VARIANT_MAP: Record<
  UebaRiskLevel,
  'destructive' | 'default' | 'secondary' | 'outline'
> = {
  [UebaRiskLevel.CRITICAL]: 'destructive',
  [UebaRiskLevel.HIGH]: 'destructive',
  [UebaRiskLevel.MEDIUM]: 'default',
  [UebaRiskLevel.LOW]: 'secondary',
}

export function useUebaAnomalyCard({
  anomaly,
  onResolve,
}: {
  anomaly: UebaAnomaly
  onResolve: (id: string) => void
}) {
  const t = useTranslations('ueba')

  const severityVariant = SEVERITY_VARIANT_MAP[anomaly.severity] ?? 'secondary'

  const handleResolve = useCallback(() => {
    onResolve(anomaly.id)
  }, [anomaly.id, onResolve])

  return {
    t,
    severityVariant,
    handleResolve,
  }
}
