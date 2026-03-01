import { NextResponse } from 'next/server'
import { mockServiceHealth } from '@/mocks/data/admin.data'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ data: mockServiceHealth })
}
