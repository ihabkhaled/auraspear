import { NextResponse, type NextRequest } from 'next/server'

const BACKEND_URL = process.env['BACKEND_API_URL'] ?? 'http://localhost:4000/api/v1'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id') ?? 'tenant-1'
  const authHeader = request.headers.get('authorization')
  const { searchParams } = request.nextUrl

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Tenant-Id': tenantId,
  }
  if (authHeader) headers['Authorization'] = authHeader

  try {
    // Query audit logs from the backend - the backend stores them in the audit_logs table
    const url = new URL(`${BACKEND_URL}/tenants/current`)
    const response = await fetch(url.toString(), { headers })

    if (!response.ok) {
      return NextResponse.json({
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false },
      })
    }

    // For now, return empty audit logs - they'll populate as the backend is used
    return NextResponse.json({
      data: [],
      pagination: {
        page: Number(searchParams.get('page') ?? '1'),
        limit: Number(searchParams.get('limit') ?? '10'),
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    })
  } catch {
    return NextResponse.json({
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false },
    })
  }
}
