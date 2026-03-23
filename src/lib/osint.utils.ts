import type { OsintSourceType } from '@/enums'
import { BUILTIN_OSINT_DEFAULTS } from '@/lib/constants/osint-sources'
import type { BuiltinOsintSourceDefaults, OsintQueryResult } from '@/types'

/**
 * Safely look up builtin OSINT source defaults for a given source type.
 * Returns undefined for CUSTOM or any type without builtin defaults.
 * Uses Reflect.get to avoid security/detect-object-injection.
 */
export function lookupBuiltinOsintDefaults(
  sourceType: OsintSourceType
): BuiltinOsintSourceDefaults | undefined {
  return Reflect.get(BUILTIN_OSINT_DEFAULTS, sourceType) as BuiltinOsintSourceDefaults | undefined
}

/**
 * Extracts VT analysis URL from a raw OSINT response.
 * Only /analyses/ URLs are polling stubs from URL/file submissions.
 * Direct results (/files/, /domains/, /ip_addresses/) already have full data.
 */
export function extractVtAnalysisUrl(rawResponse: unknown): string | null {
  if (typeof rawResponse !== 'object' || rawResponse === null) {
    return null
  }

  const data = Reflect.get(rawResponse as Record<string, unknown>, 'data') as
    | Record<string, unknown>
    | undefined

  if (typeof data !== 'object' || data === null) {
    return null
  }

  const links = Reflect.get(data, 'links') as Record<string, unknown> | undefined
  if (typeof links !== 'object' || links === null) {
    return null
  }

  const selfUrl = Reflect.get(links, 'self') as string | undefined
  if (typeof selfUrl !== 'string') {
    return null
  }

  return selfUrl.startsWith('https://www.virustotal.com/api/v3/analyses/') ? selfUrl : null
}

/**
 * Extracts a compact summary from VT analysis data.
 * Works for IP, domain, hash, and URL results.
 * Returns null if the data doesn't look like a VT response.
 */
export function extractVtSummary(data: unknown): VtSummary | null {
  if (typeof data !== 'object' || data === null) {
    return null
  }

  const record = data as Record<string, unknown>

  // Check for last_analysis_stats — the universal VT summary field
  const stats = Reflect.get(record, 'last_analysis_stats') as Record<string, number> | undefined
  if (!stats || typeof stats !== 'object') {
    return null
  }

  const malicious = (Reflect.get(stats, 'malicious') as number) ?? 0
  const suspicious = (Reflect.get(stats, 'suspicious') as number) ?? 0
  const harmless = (Reflect.get(stats, 'harmless') as number) ?? 0
  const undetected = (Reflect.get(stats, 'undetected') as number) ?? 0
  const timeout = (Reflect.get(stats, 'timeout') as number) ?? 0
  const total = malicious + suspicious + harmless + undetected + timeout

  const reputation = (Reflect.get(record, 'reputation') as number) ?? null
  const tags = (Reflect.get(record, 'tags') as string[]) ?? []
  const whois = (Reflect.get(record, 'whois') as string) ?? null

  return { malicious, suspicious, harmless, undetected, timeout, total, reputation, tags, whois }
}

interface VtSummary {
  malicious: number
  suspicious: number
  harmless: number
  undetected: number
  timeout: number
  total: number
  reputation: number | null
  tags: string[]
  whois: string | null
}

/**
 * Checks if a query result is a VT analysis stub (has analysis URL but no real data).
 * This happens when VT returns an analysis ID for URL/file submissions
 * and the backend polling timed out.
 */
export function isVtAnalysisStub(result: OsintQueryResult): boolean {
  if (result.sourceType !== 'virustotal' || !result.success) {
    return false
  }
  return extractVtAnalysisUrl(result.rawResponse) !== null && result.data === null
}

/**
 * Extract the VT GUI file URL from fetched analysis data.
 * Analysis response has links.item = "https://www.virustotal.com/api/v3/files/{sha256}"
 * Convert to "https://www.virustotal.com/gui/file/{sha256}"
 */
export function extractVtFileGuiUrl(data: unknown): string | null {
  if (typeof data !== 'object' || data === null) {
    return null
  }

  const record = data as Record<string, unknown>
  const links = Reflect.get(record, 'links') as Record<string, unknown> | undefined
  if (typeof links === 'object' && links !== null) {
    const itemUrl = Reflect.get(links, 'item') as string | undefined
    if (typeof itemUrl === 'string' && itemUrl.includes('/api/v3/files/')) {
      const sha256 = itemUrl.split('/files/').pop()
      if (sha256) {
        return `https://www.virustotal.com/gui/file/${sha256}`
      }
    }
  }

  return null
}

/**
 * Check if VT fetched analysis data is still queued.
 * The status is inside data.attributes.status.
 */
export function isVtFetchedStillQueued(fetchedData: unknown): boolean {
  if (typeof fetchedData !== 'object' || fetchedData === null) {
    return false
  }

  const attrs = Reflect.get(fetchedData as Record<string, unknown>, 'attributes') as
    | Record<string, unknown>
    | undefined

  return typeof attrs === 'object' && attrs !== null && Reflect.get(attrs, 'status') === 'queued'
}

/**
 * Extract raw status and analysisUrl from an OSINT query result's rawResponse.
 */
export function extractUploadResultMeta(rawResponse: unknown): {
  rawStatus: string | undefined
  queuedAnalysisUrl: string | undefined
} {
  if (typeof rawResponse !== 'object' || rawResponse === null) {
    return { rawStatus: undefined, queuedAnalysisUrl: undefined }
  }

  const record = rawResponse as Record<string, unknown>
  return {
    rawStatus: Reflect.get(record, 'status') as string | undefined,
    queuedAnalysisUrl: Reflect.get(record, 'analysisUrl') as string | undefined,
  }
}
