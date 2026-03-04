import { NextResponse, type NextRequest } from 'next/server'
import { BackendError, fetchBackendJson } from '@/lib/backend-proxy'
import type { BackendLoginResponse, TenantMembershipInfo } from '@/types/auth.types'

export const dynamic = 'force-dynamic'

interface BackendLoginWithTenants extends BackendLoginResponse {
  tenants: TenantMembershipInfo[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const data = (await fetchBackendJson(request, '/auth/login', {
      method: 'POST',
      body,
    })) as BackendLoginWithTenants

    return NextResponse.json({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
      tenants: data.tenants,
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
