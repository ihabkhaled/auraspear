import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { mockHuntSession, mockHuntEvents } from '@/mocks/data/hunt.data'
import type { HuntSession } from '@/types'

export const dynamic = 'force-dynamic'

const sessions: HuntSession[] = [mockHuntSession]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = sessions.find(s => s.id === id)

  if (!session) {
    return NextResponse.json(
      { error: 'Hunt session not found' },
      { status: 404 }
    )
  }

  const { searchParams } = request.nextUrl
  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '10')

  const total = mockHuntEvents.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const paginatedData = mockHuntEvents.slice(start, start + limit)

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
