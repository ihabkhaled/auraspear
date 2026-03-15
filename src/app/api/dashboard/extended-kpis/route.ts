import { NextResponse, type NextRequest } from 'next/server'
import { fetchBackendJson } from '@/lib/backend-proxy'
import type {
  IncidentStats,
  VulnerabilityStats,
  UebaStats,
  AttackPathStats,
  ComplianceStats,
  SoarStats,
  SystemHealthStats,
} from '@/types'

export const dynamic = 'force-dynamic'

interface StatsResult<T> {
  data: T
}

async function fetchStatsSafe<T>(request: NextRequest, path: string, fallback: T): Promise<T> {
  try {
    const result = (await fetchBackendJson(request, path)) as StatsResult<T>
    return result.data
  } catch {
    return fallback
  }
}

export async function GET(request: NextRequest) {
  try {
    const [incidents, vulnerabilities, ueba, attackPaths, compliance, soar, systemHealth] =
      await Promise.all([
        fetchStatsSafe<IncidentStats>(request, '/incidents/stats', {
          open: 0,
          inProgress: 0,
          contained: 0,
          resolved30d: 0,
          avgResolveHours: null,
        }),
        fetchStatsSafe<VulnerabilityStats>(request, '/vulnerabilities/stats', {
          critical: 0,
          high: 0,
          medium: 0,
          patched30d: 0,
          exploitAvailable: 0,
        }),
        fetchStatsSafe<UebaStats>(request, '/ueba/stats', {
          totalEntities: 0,
          criticalRisk: 0,
          highRisk: 0,
          anomalies24h: 0,
          activeModels: 0,
        }),
        fetchStatsSafe<AttackPathStats>(request, '/attack-paths/stats', {
          activePaths: 0,
          assetsAtRisk: 0,
          killChainCoverage: 0,
          criticalPaths: 0,
        }),
        fetchStatsSafe<ComplianceStats>(request, '/compliance/stats', {
          totalFrameworks: 0,
          avgComplianceScore: null,
          passedControls: 0,
          failedControls: 0,
          notAssessedControls: 0,
        }),
        fetchStatsSafe<SoarStats>(request, '/soar/stats', {
          totalPlaybooks: 0,
          activePlaybooks: 0,
          totalExecutions30d: 0,
          successRate: null,
          avgDurationSeconds: null,
        }),
        fetchStatsSafe<SystemHealthStats>(request, '/system-health/stats', {
          totalServices: 0,
          healthy: 0,
          degraded: 0,
          down: 0,
          avgResponseTimeMs: null,
        }),
      ])

    const totalServices = systemHealth.totalServices || 1
    const healthScore = Math.round((systemHealth.healthy / totalServices) * 100)

    const data = {
      openIncidents: incidents.open + incidents.inProgress,
      criticalVulnerabilities: vulnerabilities.critical,
      highRiskEntities: ueba.criticalRisk + ueba.highRisk,
      activeAttackPaths: attackPaths.activePaths,
      complianceScore: compliance.avgComplianceScore,
      soarExecutions: soar.totalExecutions30d,
      systemHealthScore: healthScore,
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('[dashboard/extended-kpis]', error)
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 502 })
  }
}
