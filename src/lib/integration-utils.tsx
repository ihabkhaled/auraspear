import type { ReactNode } from 'react'
import { CheckCircle2, XCircle, WifiOff } from 'lucide-react'
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
 * Returns a status icon element for the given integration status.
 */
export function getStatusIcon(status: IntegrationStatus): ReactNode {
  switch (status) {
    case IntegrationStatus.CONNECTED:
      return <CheckCircle2 className="text-status-success h-4 w-4 shrink-0" />
    case IntegrationStatus.ERROR:
      return <XCircle className="text-status-error h-4 w-4 shrink-0" />
    default:
      return <WifiOff className="text-muted-foreground h-4 w-4 shrink-0" />
  }
}
