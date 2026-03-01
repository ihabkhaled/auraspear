import { NextResponse } from 'next/server'
import { mockKPIs } from '@/mocks/data/dashboard.data'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ data: mockKPIs })
}
