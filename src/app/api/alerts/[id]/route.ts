import { NextResponse } from 'next/server'
import { mockAlerts } from '@/mocks/data/alerts.data'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const alert = mockAlerts.find(a => a.id === id)

  if (!alert) {
    return NextResponse.json(
      { error: 'Alert not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ data: alert })
}
