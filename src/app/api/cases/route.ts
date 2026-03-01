import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { mockCases } from '@/mocks/data/cases.data'
import type { Case } from '@/types'
import type { CaseStatus, CaseSeverity } from '@/enums'

export const dynamic = 'force-dynamic'

const cases: Case[] = [...mockCases]

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '10')
  const statusParam = searchParams.get('status')
  const severityParam = searchParams.get('severity')
  const query = searchParams.get('query')

  let filtered: Case[] = [...cases]

  if (statusParam) {
    const statuses = statusParam.split(',') as CaseStatus[]
    filtered = filtered.filter(c => statuses.includes(c.status))
  }

  if (severityParam) {
    const severities = severityParam.split(',') as CaseSeverity[]
    filtered = filtered.filter(c => severities.includes(c.severity))
  }

  if (query) {
    const lowerQuery = query.toLowerCase()
    filtered = filtered.filter(
      c =>
        c.title.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery) ||
        c.caseNumber.toLowerCase().includes(lowerQuery) ||
        c.assignee.toLowerCase().includes(lowerQuery)
    )
  }

  filtered.sort((a, b) => {
    const aDate = new Date(a.updatedAt).getTime()
    const bDate = new Date(b.updatedAt).getTime()
    return bDate - aDate
  })

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

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Record<string, unknown>
  const now = new Date().toISOString()
  const caseNumber = `SOC-2026-${String(cases.length + 1).padStart(3, '0')}`

  const newCase: Case = {
    id: `case-${String(cases.length + 1).padStart(3, '0')}`,
    caseNumber,
    title: body['title'] as string,
    description: body['description'] as string,
    status: 'open' as Case['status'],
    severity: body['severity'] as Case['severity'],
    assignee: body['assignee'] as string,
    createdAt: now,
    updatedAt: now,
    linkedAlertIds: (body['linkedAlertIds'] as string[] | undefined) ?? [],
    timeline: [
      {
        id: `tl-${Date.now()}`,
        timestamp: now,
        type: 'creation',
        actor: 'Current User',
        description: `Case ${caseNumber} created`,
      },
    ],
    tasks: [],
    artifacts: [],
    tenantId: 'tenant-001',
  }

  cases.unshift(newCase)

  return NextResponse.json({ data: newCase }, { status: 201 })
}
