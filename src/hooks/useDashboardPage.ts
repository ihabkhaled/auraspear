import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { isConnectorType } from '@/lib/constants/connectors.constants'
import { EXTENDED_KPI_ROUTES } from '@/lib/constants/dashboard'
import { formatDashboardPercentage } from '@/lib/dashboard.utils'
import { computeHealthPercent } from '@/lib/health-utils'
import { canAccessRouteByPermission } from '@/lib/permissions'
import { useAuthStore } from '@/stores'
import type { ExtendedKPIItem, ExtendedKPIStats } from '@/types'
import { useServiceHealth } from './useAdmin'
import {
  useKPIs,
  useAlertTrends,
  useMITREStats,
  useAssetRisks,
  useExtendedKPIs,
} from './useDashboard'

interface ExtendedKpiCandidate {
  labelKey: string
  value: number | string | null | undefined
  route: string
}

export function useDashboardPage() {
  const t = useTranslations('dashboard')
  const router = useRouter()
  const permissions = useAuthStore(s => s.permissions)
  const canViewAlertAnalytics = canAccessRouteByPermission(permissions, '/alerts')
  const canViewPipelineHealth = canAccessRouteByPermission(permissions, '/system-health')
  const { data: kpis, isLoading: kpisLoading } = useKPIs()
  const { data: trends, isLoading: trendsLoading } = useAlertTrends(canViewAlertAnalytics)
  const { data: mitre, isLoading: mitreLoading } = useMITREStats(canViewAlertAnalytics)
  const { data: assets, isLoading: assetsLoading } = useAssetRisks(canViewAlertAnalytics)
  const { data: health, isLoading: healthLoading } = useServiceHealth(canViewPipelineHealth)
  const { data: extendedKPIs, isLoading: extendedKPIsLoading } = useExtendedKPIs()
  const healthServices = health?.data ?? []
  const healthPercent = computeHealthPercent(healthServices)

  const canAccessRoute = useCallback(
    (route: string) => canAccessRouteByPermission(permissions, route),
    [permissions]
  )

  const navigateToRoute = useCallback(
    (route: string) => {
      if (!canAccessRoute(route)) {
        return
      }
      router.push(route)
    },
    [canAccessRoute, router]
  )

  const handleServiceClick = useCallback(
    (connectorType: string) => {
      const route = `/connectors/${connectorType}`
      if (isConnectorType(connectorType) && canAccessRoute(route)) {
        router.push(route)
      }
    },
    [canAccessRoute, router]
  )

  const extendedKPIItems: ExtendedKPIItem[] = useMemo(() => {
    const stats = extendedKPIs?.data as ExtendedKPIStats | null | undefined
    if (!stats) {
      return []
    }
    const items: ExtendedKpiCandidate[] = [
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
        route: EXTENDED_KPI_ROUTES['activeAttackPaths'] ?? '/attack-paths',
      },
      {
        labelKey: 'complianceScore',
        value:
          stats.complianceScore === undefined
            ? undefined
            : formatDashboardPercentage(stats.complianceScore),
        route: EXTENDED_KPI_ROUTES['complianceScore'] ?? '/compliance',
      },
      {
        labelKey: 'soarExecutions',
        value: stats.soarExecutions,
        route: EXTENDED_KPI_ROUTES['soarExecutions'] ?? '/soar',
      },
      {
        labelKey: 'systemHealthScore',
        value:
          stats.systemHealthScore === undefined
            ? undefined
            : formatDashboardPercentage(stats.systemHealthScore),
        route: EXTENDED_KPI_ROUTES['systemHealthScore'] ?? '/system-health',
      },
      {
        labelKey: 'jobBacklog',
        value: stats.jobBacklog,
        route: EXTENDED_KPI_ROUTES['jobBacklog'] ?? '/jobs',
      },
      {
        labelKey: 'onlineAiAgents',
        value: stats.onlineAiAgents,
        route: EXTENDED_KPI_ROUTES['onlineAiAgents'] ?? '/ai-agents',
      },
      {
        labelKey: 'failingConnectors',
        value: stats.failingConnectors,
        route: EXTENDED_KPI_ROUTES['failingConnectors'] ?? '/connectors',
      },
    ]

    return items.filter(
      (item): item is ExtendedKPIItem & { value: number | string } => item.value !== undefined
    )
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
    canAccessRoute,
    canViewAlertAnalytics,
    canViewPipelineHealth,
    navigateToRoute,
    extendedKPIItems,
    extendedKPIsLoading,
  }
}
