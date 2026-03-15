import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { isConnectorType } from '@/lib/constants/connectors.constants'
import { EXTENDED_KPI_ROUTES } from '@/lib/constants/dashboard'
import { computeHealthPercent } from '@/lib/health-utils'
import type { ExtendedKPIItem, ExtendedKPIStats } from '@/types'
import { useServiceHealth } from './useAdmin'
import {
  useKPIs,
  useAlertTrends,
  useMITREStats,
  useAssetRisks,
  useExtendedKPIs,
} from './useDashboard'

export function useDashboardPage() {
  const t = useTranslations('dashboard')
  const router = useRouter()
  const { data: kpis, isLoading: kpisLoading } = useKPIs()
  const { data: trends, isLoading: trendsLoading } = useAlertTrends()
  const { data: mitre, isLoading: mitreLoading } = useMITREStats()
  const { data: assets, isLoading: assetsLoading } = useAssetRisks()
  const { data: health, isLoading: healthLoading } = useServiceHealth()
  const { data: extendedKPIs, isLoading: extendedKPIsLoading } = useExtendedKPIs()
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

  const extendedKPIItems: ExtendedKPIItem[] = useMemo(() => {
    const stats = extendedKPIs?.data as ExtendedKPIStats | null | undefined
    if (!stats) {
      return []
    }
    return [
      {
        labelKey: 'openIncidents',
        value: stats.openIncidents,
        route: EXTENDED_KPI_ROUTES['openIncidents'] ?? '/incidents',
      },
      {
        labelKey: 'criticalVulnerabilities',
        value: stats.criticalVulnerabilities,
        route: EXTENDED_KPI_ROUTES['criticalVulnerabilities'] ?? '/vulnerabilities',
      },
      {
        labelKey: 'highRiskEntities',
        value: stats.highRiskEntities,
        route: EXTENDED_KPI_ROUTES['highRiskEntities'] ?? '/ueba',
      },
      {
        labelKey: 'activeAttackPaths',
        value: stats.activeAttackPaths,
        route: EXTENDED_KPI_ROUTES['activeAttackPaths'] ?? '/attack-path',
      },
      {
        labelKey: 'complianceScore',
        value: stats.complianceScore === null ? 'N/A' : `${stats.complianceScore}%`,
        route: EXTENDED_KPI_ROUTES['complianceScore'] ?? '/compliance',
      },
      {
        labelKey: 'soarExecutions',
        value: stats.soarExecutions,
        route: EXTENDED_KPI_ROUTES['soarExecutions'] ?? '/soar',
      },
      {
        labelKey: 'systemHealthScore',
        value: `${stats.systemHealthScore}%`,
        route: EXTENDED_KPI_ROUTES['systemHealthScore'] ?? '/system-health',
      },
    ]
  }, [extendedKPIs?.data])

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
    extendedKPIItems,
    extendedKPIsLoading,
  }
}
