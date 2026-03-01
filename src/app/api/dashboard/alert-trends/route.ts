import { NextResponse, type NextRequest } from 'next/server'
import { fetchBackendJson } from '@/lib/backend-proxy'

export const dynamic = 'force-dynamic'

interface BackendTrendPoint {
  date: string
  critical: number
  high: number
  medium: number
  low: number
}

interface BackendTrendResponse {
  tenantId: string
  days: number
  trend: BackendTrendPoint[]
}

export async function GET(request: NextRequest) {
  try {
    const raw = (await fetchBackendJson(request, '/dashboards/alert-trend')) as BackendTrendResponse

    const data = raw.trend ?? []

    return NextResponse.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Backend unavailable'
    return NextResponse.json({ data: null, error: message }, { status: 502 })
  }
}
