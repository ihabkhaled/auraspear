import { NextResponse, type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

// TODO: Proxy to backend once a GET /audit-logs endpoint is added to the NestJS API.
// The backend currently writes audit logs via AuditInterceptor but has no listing endpoint.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '10')

  return NextResponse.json({
    data: [],
    pagination: { page, limit, total: 0, totalPages: 0, hasNext: false, hasPrev: false },
  })
}
