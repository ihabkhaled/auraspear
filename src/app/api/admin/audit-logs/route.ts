import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { mockAuditLogs } from '@/mocks/data/admin.data'
import type { AuditLogEntry } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '10')
  const action = searchParams.get('action')
  const actor = searchParams.get('actor')
  const query = searchParams.get('query')

  let filtered: AuditLogEntry[] = [...mockAuditLogs]

  if (action) {
    const actions = action.split(',')
    filtered = filtered.filter(log => actions.includes(log.action))
  }

  if (actor) {
    filtered = filtered.filter(log =>
      log.actor.toLowerCase().includes(actor.toLowerCase())
    )
  }

  if (query) {
    const lowerQuery = query.toLowerCase()
    filtered = filtered.filter(
      log =>
        (log.details?.toLowerCase().includes(lowerQuery) ?? false) ||
        log.action.toLowerCase().includes(lowerQuery) ||
        log.actor.toLowerCase().includes(lowerQuery) ||
        log.resource.toLowerCase().includes(lowerQuery)
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
