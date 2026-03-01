import { NextResponse, type NextRequest } from 'next/server'

const BACKEND_URL = process.env['BACKEND_API_URL'] ?? 'http://localhost:4000/api/v1'

interface ProxyOptions {
  /** Backend path (e.g. '/alerts'). Defaults to the incoming request path minus '/api' prefix. */
  path?: string
  /** Override HTTP method */
  method?: string
  /** Override request body */
  body?: unknown
  /** Additional query params to merge */
  params?: Record<string, string>
}

/**
 * Proxies a Next.js API route request to the NestJS backend.
 * Forwards auth token, tenant ID, and content type headers.
 */
export async function proxyToBackend(
  request: NextRequest,
  options: ProxyOptions = {}
): Promise<NextResponse> {
  const method = options.method ?? request.method

  // Build target URL
  const targetPath = options.path ?? request.nextUrl.pathname.replace(/^\/api/, '')
  const url = new URL(`${BACKEND_URL}${targetPath}`)

  // Forward query params from original request
  for (const [key, value] of request.nextUrl.searchParams.entries()) {
    url.searchParams.set(key, value)
  }

  // Merge additional params
  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      url.searchParams.set(key, value)
    }
  }

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Forward auth token
  const authHeader = request.headers.get('authorization')
  if (authHeader) {
    headers['Authorization'] = authHeader
  }

  // Forward tenant ID
  const tenantId = request.headers.get('x-tenant-id')
  if (tenantId) {
    headers['X-Tenant-Id'] = tenantId
  }

  // Dev mode: forward dev headers for role/tenant override
  const devRole = request.headers.get('x-role')
  if (devRole) {
    headers['X-Role'] = devRole
  }

  // Build fetch options
  const fetchOptions: RequestInit = { method, headers }

  if (method !== 'GET' && method !== 'HEAD') {
    if (options.body === undefined) {
      try {
        const bodyText = await request.text()
        if (bodyText) {
          fetchOptions.body = bodyText
        }
      } catch {
        // No body
      }
    } else {
      fetchOptions.body = JSON.stringify(options.body)
    }
  }

  try {
    const backendResponse = await fetch(url.toString(), fetchOptions)
    const data: unknown = await backendResponse.json()

    // Wrap in ApiResponse format if the backend doesn't already
    const wrapped = wrapResponse(data, backendResponse.ok)

    return NextResponse.json(wrapped, { status: backendResponse.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Backend unavailable'
    return NextResponse.json({ data: null, error: message }, { status: 502 })
  }
}

function wrapResponse(data: unknown, ok: boolean): { data: unknown; error?: string } {
  // If the backend already returns a { data } wrapper, pass through
  if (typeof data === 'object' && data !== null && 'data' in (data as Record<string, unknown>)) {
    return data as { data: unknown }
  }

  // Otherwise wrap it
  if (ok) {
    return { data }
  }

  const errorData = data as Record<string, unknown>
  return {
    data: null,
    error: (errorData['message'] as string) ?? 'Request failed',
  }
}
