import { NextResponse, type NextRequest } from 'next/server'
import { fetchBackendJson } from '@/lib/backend-proxy'

export const dynamic = 'force-dynamic'

interface BackendMitreResponse {
  tenantId: string
  techniques: Array<{ id: string; count: number }>
}

export async function GET(request: NextRequest) {
  try {
    const raw = (await fetchBackendJson(
      request,
      '/dashboards/mitre-top-techniques'
    )) as BackendMitreResponse

    const techniques = raw.techniques ?? []
    const maxCount = Math.max(...techniques.map(t => t.count), 1)

    const data = techniques.map(t => ({
      id: t.id,
      name: t.id,
      count: t.count,
      percentage: Math.round((t.count / maxCount) * 100),
    }))

    return NextResponse.json({ data })
  } catch (error) {
    console.error('[dashboard/mitre-stats]', error)
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 502 })
  }
}
