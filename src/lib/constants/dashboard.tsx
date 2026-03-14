import type { ReactNode } from 'react'
import { Shield, AlertTriangle, Briefcase, Clock } from 'lucide-react'

export const KPI_ICONS: ReactNode[] = [
  <Shield key="shield" className="h-5 w-5" />,
  <AlertTriangle key="alert" className="h-5 w-5" />,
  <Briefcase key="briefcase" className="h-5 w-5" />,
  <Clock key="clock" className="h-5 w-5" />,
]

export const KPI_COLORS = [
  'var(--primary)',
  'var(--severity-critical)',
  'var(--status-info)',
  'var(--status-success)',
]

export const KPI_ROUTES: Record<string, string> = {
  totalAlerts: '/alerts?timeRange=7d',
  criticalAlerts: '/alerts?timeRange=7d&severity=critical',
  openCases: '/cases?status=open',
}
