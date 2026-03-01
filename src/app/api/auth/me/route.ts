import { NextResponse, type NextRequest } from 'next/server'
import { BackendError, fetchBackendJson } from '@/lib/backend-proxy'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const data = await fetchBackendJson(request, '/auth/me')

    return NextResponse.json(data)
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
