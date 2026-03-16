import { AlertSeverity } from '@/enums'
import type { CaseSeverity } from '@/enums'
import { SEVERITY_COLORS, type SEVERITY_TEXT_CLASSES } from '@/lib/constants'
import { lookup } from '@/lib/utils'

/**
 * Returns combined bg + text + border status classes for an alert severity.
 * Used by severity badges in tables and drawers.
 */
export function getSeverityVariant(severity: AlertSeverity): string {
  switch (severity) {
    case AlertSeverity.CRITICAL:
      return 'bg-status-error text-status-error border-status-error'
    case AlertSeverity.HIGH:
      return 'bg-status-warning text-status-warning border-status-warning'
    case AlertSeverity.MEDIUM:
      return 'bg-status-info text-status-info border-status-info'
    case AlertSeverity.LOW:
      return 'bg-status-success text-status-success border-status-success'
    case AlertSeverity.INFO:
      return 'bg-status-neutral text-status-neutral border-status-neutral'
  }
}

/**
 * Alias kept for call-sites that used the former name `getSeverityClass`.
 * Identical implementation to `getSeverityVariant`.
 */
export const getSeverityClass = getSeverityVariant

/**
 * Returns a CSS colour value (CSS variable reference) for a given severity string.
 * Used by chart components.
 */
export function getSeverityColor(severity: string): string {
  const key = severity as keyof typeof SEVERITY_COLORS
  return lookup(SEVERITY_COLORS, key) ?? 'var(--muted-foreground)'
}

/**
 * Type-safe severity key mapper for shared severity constants.
 * Used by SeverityBadge and similar components.
 */
export function getSeverityKey(
  severity: AlertSeverity | CaseSeverity
): keyof typeof SEVERITY_TEXT_CLASSES {
  return severity as keyof typeof SEVERITY_TEXT_CLASSES
}
