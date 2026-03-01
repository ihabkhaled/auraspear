import { NextResponse } from 'next/server'
import { mockPipelineServices } from '@/mocks/data/dashboard.data'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ data: mockPipelineServices })
}
