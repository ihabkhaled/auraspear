import { IntegrationStatus } from '@/enums'

/**
 * Returns a border class hinting at the integration connection status.
 */
export function getStatusBorderClass(status: IntegrationStatus): string {
  switch (status) {
    case IntegrationStatus.CONNECTED:
      return 'border-status-success/30'
    case IntegrationStatus.ERROR:
      return 'border-status-error/30'
    default:
      return ''
  }
}
