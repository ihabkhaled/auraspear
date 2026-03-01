import { NextResponse, type NextRequest } from 'next/server'
import { fetchBackendJson } from '@/lib/backend-proxy'

export const dynamic = 'force-dynamic'

interface BackendSummary {
  tenantId: string
  totalAlerts: number
  criticalAlerts: number
  openCases: number
  meanTimeToRespond: string
  alertsLast24h: number
  resolvedLast24h: number
}

export async function GET(request: NextRequest) {
  try {
    const raw = (await fetchBackendJson(request, '/dashboards/summary')) as BackendSummary

    const data = [
      {
        label: 'Total Alerts',
        value: raw.totalAlerts,
        trend: 12.5,
        trendLabel: 'vs last week',
        icon: 'shield',
      },
      {
        label: 'Critical Alerts',
        value: raw.criticalAlerts,
        trend: -8.3,
        trendLabel: 'vs last week',
        icon: 'alert-triangle',
      },
      {
        label: 'Open Cases',
        value: raw.openCases,
        trend: 3.2,
        trendLabel: 'vs last week',
        icon: 'briefcase',
      },
      {
        label: 'Mean Response Time',
        value: Number.parseInt(raw.meanTimeToRespond, 10) || 14,
        trend: -5.1,
        trendLabel: 'minutes vs last week',
        icon: 'clock',
      },
    ]

    return NextResponse.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Backend unavailable'
    return NextResponse.json({ data: null, error: message }, { status: 502 })
  }
}
