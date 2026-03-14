import { AlertStatus, TimeRange } from '@/enums'

export const ALERT_TIME_RANGES = [TimeRange.H24, TimeRange.D7, TimeRange.D30] as const

export const ALERT_STATUS_CLASSES: Record<AlertStatus, string> = {
  [AlertStatus.NEW_ALERT]: 'border-status-info text-status-info',
  [AlertStatus.ACKNOWLEDGED]: 'border-status-warning text-status-warning',
  [AlertStatus.IN_PROGRESS]: 'border-status-warning text-status-warning',
  [AlertStatus.RESOLVED]: 'border-status-success text-status-success',
  [AlertStatus.CLOSED]: 'border-muted-foreground text-muted-foreground',
  [AlertStatus.FALSE_POSITIVE]: 'border-muted-foreground text-muted-foreground',
}

export const ALERT_STATUS_LABEL_KEYS: Record<AlertStatus, string> = {
  [AlertStatus.NEW_ALERT]: 'statusNewAlert',
  [AlertStatus.ACKNOWLEDGED]: 'statusAcknowledged',
  [AlertStatus.IN_PROGRESS]: 'statusInProgress',
  [AlertStatus.RESOLVED]: 'statusResolved',
  [AlertStatus.CLOSED]: 'statusClosed',
  [AlertStatus.FALSE_POSITIVE]: 'statusFalsePositive',
}
