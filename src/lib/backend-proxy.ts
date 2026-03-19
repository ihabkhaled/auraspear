import { NextResponse, type NextRequest } from 'next/server'
import type { FetchOptions, ProxyOptions } from '@/types'

const BACKEND_URL = process.env['BACKEND_API_URL'] ?? 'http://localhost:4000/api/v1'

/** Headers to prevent caching of authenticated API responses */
const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
} as const

/**
 * Returns a NextResponse.json() with Cache-Control: no-store headers.
 * Use this in API routes that call fetchBackendJson() and build their own response.
 */
export function jsonNoStore(body: unknown, init?: ResponseInit): NextResponse {
  const headers = new Headers(init?.headers)
  for (const [key, value] of Object.entries(NO_STORE_HEADERS)) {
    headers.set(key, value)
  }
  return NextResponse.json(body, { ...init, headers })
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

  // Forward cookies (HttpOnly auth cookies from browser → backend)
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader) {
    headers['Cookie'] = cookieHeader
  }

  // Forward tenant ID
  const tenantId = request.headers.get('x-tenant-id')
  if (tenantId) {
    headers['X-Tenant-Id'] = tenantId
  }

  const csrfToken = request.headers.get('x-csrf-token')
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken
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

    const responseInit: ResponseInit = { status: backendResponse.status }

    // Forward Set-Cookie headers from backend to browser (HttpOnly auth cookies)
    const setCookieHeaders = backendResponse.headers.getSetCookie()
    if (setCookieHeaders.length > 0) {
      const respHeaders = new Headers()
      for (const cookie of setCookieHeaders) {
        respHeaders.append('Set-Cookie', cookie)
      }
      responseInit.headers = respHeaders
    }

    return jsonNoStore(wrapped, responseInit)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Backend unavailable'
    return jsonNoStore(
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
 * Result from fetchBackendJson including optional Set-Cookie headers
 * for forwarding HttpOnly auth cookies from the backend to the browser.
 */
export interface BackendJsonResult {
  data: unknown
  setCookieHeaders: string[]
}

/**
 * Builds a Headers object containing Set-Cookie entries for forwarding to the browser.
 * Returns undefined if there are no cookies to forward.
 */
export function buildSetCookieHeaders(setCookieHeaders: string[]): Headers | undefined {
  if (setCookieHeaders.length === 0) {
    return undefined
  }
  const headers = new Headers()
  for (const cookie of setCookieHeaders) {
    headers.append('Set-Cookie', cookie)
  }
  return headers
}

/**
 * Fetches raw JSON data from the NestJS backend.
 * Unlike proxyToBackend, this returns the parsed JSON so routes can transform it.
 * Throws BackendError on non-2xx responses with messageKey for i18n.
 * Also returns Set-Cookie headers from the backend for cookie forwarding.
 */
export async function fetchBackendJson(
  request: NextRequest,
  path: string,
  options?: FetchOptions
): Promise<BackendJsonResult> {
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

  // Forward cookies (HttpOnly auth cookies from browser → backend)
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader) {
    headers['Cookie'] = cookieHeader
  }

  const tenantId = request.headers.get('x-tenant-id')
  if (tenantId) {
    headers['X-Tenant-Id'] = tenantId
  }

  const csrfToken = request.headers.get('x-csrf-token')
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken
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

  const data: unknown = await response.json()
  const setCookieHeaders = response.headers.getSetCookie()

  return { data, setCookieHeaders }
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
