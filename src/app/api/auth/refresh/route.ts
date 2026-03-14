import { NextResponse, type NextRequest } from 'next/server'
import { BackendError, fetchBackendJson } from '@/lib/backend-proxy'
import type { BackendRefreshResponse } from '@/types'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const data = (await fetchBackendJson(request, '/auth/refresh', {
      method: 'POST',
      body,
    })) as BackendRefreshResponse

    return NextResponse.json({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    })
  } catch (error) {
    if (error instanceof BackendError) {
      return NextResponse.json(
        { messageKey: error.messageKey, message: error.message },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { messageKey: 'errors.common.unknown', message: 'Backend unavailable' },
      { status: 502 }
    )
  }
}
