import { NextResponse } from 'next/server'
import { mockCases } from '@/mocks/data/cases.data'
import type { Case } from '@/types'

export const dynamic = 'force-dynamic'

const cases: Case[] = [...mockCases]

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const foundCase = cases.find(c => c.id === id)

  if (!foundCase) {
    return NextResponse.json(
      { error: 'Case not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ data: foundCase })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = (await request.json()) as Record<string, unknown>
  const caseIndex = cases.findIndex(c => c.id === id)

  if (caseIndex === -1) {
    return NextResponse.json(
      { error: 'Case not found' },
      { status: 404 }
    )
  }

  const existingCase = cases[caseIndex]
  if (!existingCase) {
    return NextResponse.json(
      { error: 'Case not found' },
      { status: 404 }
    )
  }

  const now = new Date().toISOString()
  const updatedCase: Case = {
    ...existingCase,
    ...body,
    updatedAt: now,
    timeline: [
      ...existingCase.timeline,
      {
        id: `tl-${Date.now()}`,
        timestamp: now,
        type: 'update',
        actor: 'Current User',
        description: `Case updated: ${Object.keys(body).join(', ')} modified`,
      },
    ],
  }

  if (body['status'] === 'closed') {
    updatedCase.closedAt = now
  }

  cases[caseIndex] = updatedCase

  return NextResponse.json({ data: updatedCase })
}
