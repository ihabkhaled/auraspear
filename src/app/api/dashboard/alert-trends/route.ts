import { NextResponse } from 'next/server'
import { mockAlertTrends } from '@/mocks/data/dashboard.data'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ data: mockAlertTrends })
}
