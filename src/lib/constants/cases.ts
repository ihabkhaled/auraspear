import { CaseSeverity, CaseStatus } from '@/enums'

export const CASE_STATUS_LABEL_KEYS: Record<CaseStatus, string> = {
  [CaseStatus.OPEN]: 'statusOpen',
  [CaseStatus.IN_PROGRESS]: 'statusInProgress',
  [CaseStatus.CLOSED]: 'statusClosed',
}

export const CASE_SEVERITY_BORDER_COLORS: Record<CaseSeverity, string> = {
  [CaseSeverity.CRITICAL]: 'var(--severity-critical)',
  [CaseSeverity.HIGH]: 'var(--severity-high)',
  [CaseSeverity.MEDIUM]: 'var(--severity-medium)',
  [CaseSeverity.LOW]: 'var(--severity-low)',
}

export const KANBAN_COLUMN_CONFIG = [
  {
    status: CaseStatus.OPEN,
    labelKey: 'statusOpen',
    dotClass: 'bg-status-info',
    animate: false,
  },
  {
    status: CaseStatus.IN_PROGRESS,
    labelKey: 'statusInProgress',
    dotClass: 'bg-primary',
    animate: true,
  },
  {
    status: CaseStatus.CLOSED,
    labelKey: 'statusClosed',
    dotClass: 'bg-status-success',
    animate: false,
  },
] as const

export const CASE_SEVERITY_FILTERS = [
  CaseSeverity.CRITICAL,
  CaseSeverity.HIGH,
  CaseSeverity.MEDIUM,
  CaseSeverity.LOW,
] as const
