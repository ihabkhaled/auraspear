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
