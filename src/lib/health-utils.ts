import { ServiceStatus } from '@/enums'
import type { ServiceHealth } from '@/types'

/**
 * Returns the Tailwind dot-colour class for a service status indicator.
 */
export function getStatusDotClass(status: ServiceStatus): string {
  switch (status) {
    case ServiceStatus.HEALTHY:
      return 'bg-status-success'
    case ServiceStatus.DEGRADED:
      return 'bg-status-warning'
    case ServiceStatus.DOWN:
      return 'bg-status-error'
    case ServiceStatus.MAINTENANCE:
      return 'bg-status-info'
    default:
      return 'bg-status-neutral'
  }
}

/**
 * Returns the border hint class for a service status card.
 */
export function getStatusBgHint(status: ServiceStatus): string {
  switch (status) {
    case ServiceStatus.HEALTHY:
      return 'border-status-success/30'
    case ServiceStatus.DEGRADED:
      return 'border-status-warning/30'
    case ServiceStatus.DOWN:
      return 'border-status-error/30'
    case ServiceStatus.MAINTENANCE:
      return 'border-status-info/30'
    default:
      return ''
  }
}

/**
 * Computes overall health percentage: healthy services / total services × 100.
 * Returns 0 when no services are present.
 */
export function computeHealthPercent(services: ServiceHealth[]): number {
  if (services.length === 0) return 0
  const healthyCount = services.filter(s => s.status === ServiceStatus.HEALTHY).length
  return Math.round((healthyCount / services.length) * 100)
}

/**
 * Returns the maximum latency (ms) across all services.
 * Returns 0 when no services are present.
 */
export function computeMaxLatency(services: ServiceHealth[]): number {
  if (services.length === 0) return 0
  return Math.max(...services.map(s => s.latencyMs))
}

/**
 * Returns a text colour class for the health percentage indicator.
 */
export function getHealthStatusClass(percent: number): string {
  if (percent >= 90) return 'text-status-success'
  if (percent >= 70) return 'text-status-warning'
  return 'text-status-error'
}

/**
 * Returns a background colour class for the health percentage indicator.
 */
export function getHealthBgClass(percent: number): string {
  if (percent >= 90) return 'bg-status-success'
  if (percent >= 70) return 'bg-status-warning'
  return 'bg-status-error'
}

/**
 * Returns a translated label for the given service status.
 * `t` must be the `useTranslations('admin')` return value.
 */
export function getStatusLabel(status: ServiceStatus, t: (key: string) => string): string {
  switch (status) {
    case ServiceStatus.HEALTHY:
      return t('services.statusHealthy')
    case ServiceStatus.DEGRADED:
      return t('services.statusDegraded')
    case ServiceStatus.DOWN:
      return t('services.statusDown')
    case ServiceStatus.MAINTENANCE:
      return t('services.statusMaintenance')
    default:
      return t('services.statusUnknown')
  }
}
