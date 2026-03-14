import { NextResponse, type NextRequest } from 'next/server'
import type { FetchOptions, ProxyOptions } from '@/types'

const BACKEND_URL = process.env['BACKEND_API_URL'] ?? 'http://localhost:4000/api/v1'

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
  if (process.env['NODE_ENV'] === 'development') {
    const devRole = request.headers.get('x-role')
    if (devRole) {
      headers['X-Role'] = devRole
    }
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
    return NextResponse.json(
      { data: null, error: message, messageKey: 'errors.serviceUnavailable' },
      { status: 502 }
    )
  }
}

export class BackendError extends Error {
  status: number
  messageKey: string
  constructor(status: number, message: string, messageKey: string) {
    super(message)
    this.status = status
    this.messageKey = messageKey
  }
}

/**
 * Fetches raw JSON data from the NestJS backend.
 * Unlike proxyToBackend, this returns the parsed JSON so routes can transform it.
 * Throws BackendError on non-2xx responses with messageKey for i18n.
 */
export async function fetchBackendJson(
  request: NextRequest,
  path: string,
  options?: FetchOptions
): Promise<unknown> {
  const url = new URL(`${BACKEND_URL}${path}`)

  for (const [key, value] of request.nextUrl.searchParams.entries()) {
    url.searchParams.set(key, value)
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader) {
    headers['Authorization'] = authHeader
  }

  const tenantId = request.headers.get('x-tenant-id')
  if (tenantId) {
    headers['X-Tenant-Id'] = tenantId
  }

  const fetchInit: RequestInit = {
    method: options?.method ?? 'GET',
    headers,
  }

  if (options?.body) {
    fetchInit.body = options.body
  }

  const response = await fetch(url.toString(), fetchInit)

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as Record<string, unknown>
    const message = (errorData['message'] as string) ?? 'Request failed'
    const messageKey =
      (errorData['messageKey'] as string) ?? mapErrorToKey(response.status, message)
    throw new BackendError(response.status, message, messageKey)
  }

  return response.json()
}

function mapErrorToKey(status: number, message: string): string {
  const lower = message.toLowerCase()
  if (status === 401 && lower.includes('invalid email or password')) {
    return 'errors.auth.invalidCredentials'
  }
  if (status === 401 && lower.includes('expired')) {
    return 'errors.auth.tokenExpired'
  }
  if (status === 401) {
    return 'errors.auth.unauthorized'
  }
  if (status === 403) {
    return 'errors.auth.forbidden'
  }
  if (status === 404) {
    return 'errors.common.notFound'
  }
  if (status === 400) {
    return 'errors.common.validation'
  }
  return 'errors.common.unknown'
}

/** Keys that belong to our standard API response wrapper. */
const API_WRAPPER_KEYS = new Set(['data', 'pagination', 'error', 'messageKey', 'errors'])

function isAlreadyWrapped(obj: Record<string, unknown>): boolean {
  return 'data' in obj && Object.keys(obj).every(key => API_WRAPPER_KEYS.has(key))
}

function wrapResponse(
  data: unknown,
  ok: boolean
): { data: unknown; error?: string; messageKey?: string; errors?: string[] } {
  // If the backend already returns our { data, pagination?, error? } wrapper, pass through
  if (
    typeof data === 'object' &&
    data !== null &&
    isAlreadyWrapped(data as Record<string, unknown>)
  ) {
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
    messageKey: (errorData['messageKey'] as string) ?? undefined,
    errors: (errorData['errors'] as string[]) ?? undefined,
  }
}
