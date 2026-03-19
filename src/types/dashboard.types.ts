import type { ReactNode } from 'react'
import type { ServiceHealth } from './admin.types'

export interface DashboardKPI {
  label: string
  value: number
  trend: number
  trendLabel: string
  icon: string
}

export interface AlertTrendPoint {
  date: string
  critical: number
  high: number
  medium: number
  low: number
}

export interface MITRETechnique {
  id: string
  name: string
  count: number
  percentage: number
}

export interface AssetRisk {
  id: string
  name: string
  ip: string
  riskScore: number
  alertCount: number
}

export interface PipelineService {
  name: string
  status: string
  healthy: boolean
}

export interface BackendSummary {
  tenantId: string
  totalAlerts: number
  criticalAlerts: number
  openCases: number
  alertsLast24h: number
  resolvedLast24h: number
  meanTimeToRespond: string
  connectedSources: number
  totalAlertsTrend: number
  criticalAlertsTrend: number
  openCasesTrend: number
  mttrTrend: number
}

export interface BackendTrendPoint {
  date: string
  critical: number
  high: number
  medium: number
  low: number
}

export interface BackendTrendResponse {
  tenantId: string
  days: number
  trend: BackendTrendPoint[]
}

export interface BackendTechnique {
  id: string
  name: string
  tactic: string
  count: number
}

export interface BackendMitreResponse {
  tenantId: string
  techniques: BackendTechnique[]
}

export interface BackendAsset {
  hostname: string
  alertCount: number
  criticalCount: number
  lastSeen: string
}

export interface BackendAssetsResponse {
  tenantId: string
  assets: BackendAsset[]
}

export interface BackendPipeline {
  name: string
  type: string
  status: string
  lastChecked: string | null
  lastError: string | null
}

export interface BackendPipelineResponse {
  tenantId: string
  pipelines: BackendPipeline[]
}

export interface DashboardCardProps {
  title: string
  action?: ReactNode | undefined
  children: ReactNode
  className?: string | undefined
}

export interface TopTargetedAssetsProps {
  assets: AssetRisk[]
}

export interface PipelineHealthBarProps {
  services: ServiceHealth[]
  onServiceClick?: ((connectorType: string) => void) | undefined
}

export interface MITRETopTechniquesProps {
  techniques: MITRETechnique[]
}

export interface ExtendedKPIStats {
  openIncidents?: number | null
  criticalVulnerabilities?: number | null
  highRiskEntities?: number | null
  activeAttackPaths?: number | null
  complianceScore?: number | null
  soarExecutions?: number | null
  systemHealthScore?: number | null
  jobBacklog?: number | null
  onlineAiAgents?: number | null
  failingConnectors?: number | null
}

export interface RecentActivityItem {
  id: string
  type: string
  actorName: string
  title: string
  message: string
  createdAt: string
  isRead: boolean
}

export interface RecentActivityFeedProps {
  items: RecentActivityItem[]
  onViewAll?: (() => void) | undefined
}

export interface ExtendedKPIItem {
  labelKey: string
  value: number | string
  route: string
}
