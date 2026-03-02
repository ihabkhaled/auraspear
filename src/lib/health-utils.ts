import { ServiceStatus } from '@/enums'

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
