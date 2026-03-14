import { NextResponse, type NextRequest } from 'next/server'
import { ServiceStatus } from '@/enums'
import { fetchBackendJson } from '@/lib/backend-proxy'
import type { BackendPipelineResponse } from '@/types/dashboard.types'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const raw = (await fetchBackendJson(
      request,
      '/dashboards/pipeline-health'
    )) as BackendPipelineResponse

    const pipelines = raw.pipelines ?? []

    const data = pipelines.map(p => ({
      name: p.name,
      status: p.status,
      healthy: p.status === ServiceStatus.HEALTHY,
    }))

    return NextResponse.json({ data })
  } catch (error) {
    console.error('[dashboard/pipeline-health]', error)
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 502 })
  }
}
