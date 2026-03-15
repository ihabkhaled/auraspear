import { clsx, type ClassValue } from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { twMerge } from 'tailwind-merge'

dayjs.extend(relativeTime)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return dayjs(date).format('MMM D, YYYY')
}

export function formatTimestamp(date: string | Date): string {
  return dayjs(date).format('MMM D, YYYY HH:mm:ss')
}

export function formatRelativeTime(date: string | Date): string {
  return dayjs(date).fromNow()
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

export function formatPercentage(value: number | undefined | null): string {
  if (value === undefined || value === null) {
    return '-'
  }
  return `${value.toFixed(1)}%`
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function getNestedValue<T>(row: T, key: string): unknown {
  return key.split('.').reduce<unknown>((obj, k) => {
    if (obj !== null && obj !== undefined && typeof obj === 'object') {
      return (obj as Record<string, unknown>)[k]
    }
    return
  }, row)
}

/**
 * Parse InfluxDB Flux CSV response into structured rows and columns.
 * Handles the annotated CSV format returned by InfluxDB queries.
 */
export function parseFluxCSV(csv: string): {
  columns: string[]
  rows: Record<string, string>[]
} {
  const lines = csv.split('\n').filter(line => line.trim().length > 0)
  if (lines.length === 0) return { columns: [], rows: [] }

  // Find the header line (first non-empty, non-annotation line)
  let headerIdx = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ''
    // Skip annotation lines that start with #
    if (line.startsWith('#')) {
      headerIdx = i + 1
      continue
    }
    break
  }

  const headerLine = lines[headerIdx]
  if (!headerLine) return { columns: [], rows: [] }

  const headers = headerLine.split(',').map(h => h.trim())
  // Filter out internal columns (empty first col, "result", "table")
  const visibleHeaders = headers.filter(h => h.length > 0 && h !== 'result' && h !== 'table')

  const rows: Record<string, string>[] = []
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i] ?? ''
    if (line.startsWith('#') || line.trim().length === 0) continue

    const values = line.split(',')
    const row: Record<string, string> = {}
    for (const header of visibleHeaders) {
      const colIdx = headers.indexOf(header)
      row[header] = colIdx >= 0 ? (values[colIdx]?.trim() ?? '') : ''
    }
    rows.push(row)
  }

  return { columns: visibleHeaders, rows }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return '0 B'
  }
  const units = ['B', 'KB', 'MB', 'GB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const size = bytes / Math.pow(k, i)
  return `${Math.round(size * 100) / 100} ${units[i] ?? 'B'}`
}
