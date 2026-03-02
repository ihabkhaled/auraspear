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
  meanTimeToRespond: string
  alertsLast24h: number
  resolvedLast24h: number
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
  status: string
  eps: number
  lag: string
}

export interface BackendPipelineResponse {
  tenantId: string
  pipelines: BackendPipeline[]
}
