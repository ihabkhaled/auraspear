import { NextResponse, type NextRequest } from 'next/server'
import { fetchBackendJson } from '@/lib/backend-proxy'

export const dynamic = 'force-dynamic'

interface BackendTechnique {
  id: string
  name: string
  tactic: string
  count: number
}

interface BackendMitreResponse {
  tenantId: string
  techniques: BackendTechnique[]
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
      name: t.name,
      count: t.count,
      percentage: Math.round((t.count / maxCount) * 100),
    }))

    return NextResponse.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Backend unavailable'
    return NextResponse.json({ data: null, error: message }, { status: 502 })
  }
}
