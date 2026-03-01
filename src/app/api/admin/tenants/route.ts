import { NextResponse } from 'next/server'
import { mockTenants } from '@/mocks/data/admin.data'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ data: mockTenants })
}

export async function POST(request: Request) {
  const body = (await request.json()) as { name: string; environment: string }
  const newTenant = {
    id: `tenant-${String(mockTenants.length + 1).padStart(3, '0')}`,
    name: body.name,
    environment: body.environment,
    alertCount: 0,
    userCount: 0,
    status: 'active',
  }
  mockTenants.push(newTenant)
  return NextResponse.json({ data: newTenant }, { status: 201 })
}
