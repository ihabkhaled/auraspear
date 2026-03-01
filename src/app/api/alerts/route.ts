import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { mockAlerts } from '@/mocks/data/alerts.data'
import type { Alert } from '@/types'
import type { AlertSeverity, AlertStatus } from '@/enums'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '10')
  const severityParam = searchParams.get('severity')
  const statusParam = searchParams.get('status')
  const query = searchParams.get('query')
  const sortBy = searchParams.get('sortBy') ?? 'timestamp'
  const sortOrder = searchParams.get('sortOrder') ?? 'desc'

  let filtered: Alert[] = [...mockAlerts]

  if (severityParam) {
    const severities = severityParam.split(',') as AlertSeverity[]
    filtered = filtered.filter(alert => severities.includes(alert.severity))
  }

  if (statusParam) {
    const statuses = statusParam.split(',') as AlertStatus[]
    filtered = filtered.filter(alert => statuses.includes(alert.status))
  }

  if (query) {
    const lowerQuery = query.toLowerCase()
    filtered = filtered.filter(
      alert =>
        alert.ruleName.toLowerCase().includes(lowerQuery) ||
        alert.description.toLowerCase().includes(lowerQuery) ||
        alert.agentName.toLowerCase().includes(lowerQuery) ||
        alert.sourceIp.includes(lowerQuery) ||
        alert.destinationIp.includes(lowerQuery)
    )
  }

  filtered.sort((a, b) => {
    const aVal = a[sortBy as keyof Alert] as string
    const bVal = b[sortBy as keyof Alert] as string
    if (sortOrder === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    }
    return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
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
