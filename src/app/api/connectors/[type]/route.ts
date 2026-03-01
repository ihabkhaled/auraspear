import { type NextRequest } from 'next/server'
import { proxyToBackend } from '@/lib/backend-proxy'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params
  return proxyToBackend(request, { path: `/connectors/${type}` })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params
  return proxyToBackend(request, { path: `/connectors/${type}` })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params
  return proxyToBackend(request, { path: `/connectors/${type}` })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params
  // POST to /connectors/:type/test
  return proxyToBackend(request, { path: `/connectors/${type}/test` })
}
