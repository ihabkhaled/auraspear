import { NextResponse, type NextRequest } from 'next/server'
import { fetchBackendJson } from '@/lib/backend-proxy'
import type { BackendAssetsResponse } from '@/types/dashboard.types'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const raw = (await fetchBackendJson(
      request,
      '/dashboards/top-targeted-assets'
    )) as BackendAssetsResponse

    const assets = raw.assets ?? []

    const data = assets.map((asset, index) => ({
      id: `asset-${String(index + 1)}`,
      name: asset.hostname,
      ip: `10.0.${String(Math.floor(index / 5) + 1)}.${String(index * 5 + 1)}`,
      riskScore: Math.min(
        100,
        Math.round((asset.criticalCount / Math.max(asset.alertCount, 1)) * 100 + asset.alertCount)
      ),
      alertCount: asset.alertCount,
    }))

    return NextResponse.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Backend unavailable'
    return NextResponse.json({ data: null, error: message }, { status: 502 })
  }
}
