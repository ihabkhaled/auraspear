import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { isConnectorType } from '@/lib/constants/connectors.constants'
import { computeHealthPercent } from '@/lib/health-utils'
import { useServiceHealth } from './useAdmin'
import { useKPIs, useAlertTrends, useMITREStats, useAssetRisks } from './useDashboard'

export function useDashboardPage() {
  const t = useTranslations('dashboard')
  const router = useRouter()
  const { data: kpis, isLoading: kpisLoading } = useKPIs()
  const { data: trends, isLoading: trendsLoading } = useAlertTrends()
  const { data: mitre, isLoading: mitreLoading } = useMITREStats()
  const { data: assets, isLoading: assetsLoading } = useAssetRisks()
  const { data: health, isLoading: healthLoading } = useServiceHealth()
  const healthServices = health?.data ?? []
  const healthPercent = computeHealthPercent(healthServices)

  const handleServiceClick = useCallback(
    (connectorType: string) => {
      if (isConnectorType(connectorType)) {
        router.push(`/connectors/${connectorType}`)
      }
    },
    [router]
  )

  return {
    t,
    kpis,
    kpisLoading,
    trends,
    trendsLoading,
    mitre,
    mitreLoading,
    assets,
    assetsLoading,
    healthLoading,
    healthServices,
    healthPercent,
    handleServiceClick,
    router,
  }
}
