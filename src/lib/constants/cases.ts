import { CaseSeverity, CaseStatus } from '@/enums'

export const ASSIGNEE_OPTIONS = [
  { label: 'Ahmed Al-Rashid', value: 'ahmed' },
  { label: 'Fatima Hassan', value: 'fatima' },
  { label: 'Omar Khalil', value: 'omar' },
  { label: 'Sara Nasser', value: 'sara' },
]

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
