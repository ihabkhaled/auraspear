import { AlertSeverity } from '@/enums'

export function getSeverityDotClass(severity: AlertSeverity): string {
  switch (severity) {
    case AlertSeverity.CRITICAL:
      return 'bg-status-error'
    case AlertSeverity.HIGH:
      return 'bg-status-warning'
    case AlertSeverity.MEDIUM:
      return 'bg-status-info'
    case AlertSeverity.LOW:
      return 'bg-status-success'
    case AlertSeverity.INFO:
      return 'bg-status-neutral'
  }
}

export const SEVERITY_ORDER = [
  AlertSeverity.CRITICAL,
  AlertSeverity.HIGH,
  AlertSeverity.MEDIUM,
  AlertSeverity.LOW,
  AlertSeverity.INFO,
] as const
