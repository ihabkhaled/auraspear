import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { mockUsers } from '@/mocks/data/admin.data'
import type { TenantUser } from '@/types'
import type { UserRole } from '@/enums'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '10')
  const role = searchParams.get('role')
  const status = searchParams.get('status')
  const query = searchParams.get('query')

  let filtered: TenantUser[] = [...mockUsers]

  if (role) {
    const roles = role.split(',') as UserRole[]
    filtered = filtered.filter(user => roles.includes(user.role))
  }

  if (status) {
    const statuses = status.split(',')
    filtered = filtered.filter(user => statuses.includes(user.status))
  }

  if (query) {
    const lowerQuery = query.toLowerCase()
    filtered = filtered.filter(
      user =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery)
    )
  }

  const total = filtered.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const paginatedData = filtered.slice(start, start + limit)

  return NextResponse.json({
    data: paginatedData,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  })
}
