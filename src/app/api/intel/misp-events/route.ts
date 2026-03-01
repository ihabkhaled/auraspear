import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { mockMISPEvents } from '@/mocks/data/intel.data'
import type { MISPEvent } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '10')
  const threatLevel = searchParams.get('threatLevel')
  const query = searchParams.get('query')

  let filtered: MISPEvent[] = [...mockMISPEvents]

  if (threatLevel) {
    const levels = threatLevel.split(',')
    filtered = filtered.filter(event => levels.includes(event.threatLevel))
  }

  if (query) {
    const lowerQuery = query.toLowerCase()
    filtered = filtered.filter(
      event =>
        event.info.toLowerCase().includes(lowerQuery) ||
        event.organization.toLowerCase().includes(lowerQuery) ||
        event.tags.some(tag => tag.name.toLowerCase().includes(lowerQuery))
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
