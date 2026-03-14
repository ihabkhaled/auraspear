import { CheckCircle, XCircle } from 'lucide-react'
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

/**
 * Returns a JSX icon element for the given integration status.
 */
export function getStatusIcon(status: IntegrationStatus) {
  switch (status) {
    case IntegrationStatus.CONNECTED:
      return <CheckCircle className="text-status-success h-4 w-4" />
    case IntegrationStatus.DISCONNECTED:
      return <XCircle className="text-status-neutral h-4 w-4" />
    case IntegrationStatus.ERROR:
      return <XCircle className="text-status-error h-4 w-4" />
    default:
      return <XCircle className="text-status-neutral h-4 w-4" />
  }
}
