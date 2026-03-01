import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { mockIOCCorrelations } from '@/mocks/data/intel.data'
import type { IOCCorrelation } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '10')
  const severity = searchParams.get('severity')

  let filtered: IOCCorrelation[] = [...mockIOCCorrelations]

  if (severity) {
    const severities = severity.split(',')
    filtered = filtered.filter(ioc => severities.includes(ioc.severity))
  }

  filtered.sort((a, b) => b.hitCount - a.hitCount)

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
