import { CaseStatus } from '@/enums'

export const STATUS_VARIANT_MAP: Record<CaseStatus, 'default' | 'secondary' | 'outline'> = {
  [CaseStatus.OPEN]: 'default',
  [CaseStatus.IN_PROGRESS]: 'secondary',
  [CaseStatus.CLOSED]: 'outline',
}

export function getAvailableTransitions(status: CaseStatus): CaseStatus[] {
  switch (status) {
    case CaseStatus.OPEN:
      return [CaseStatus.IN_PROGRESS, CaseStatus.CLOSED]
    case CaseStatus.IN_PROGRESS:
      return [CaseStatus.CLOSED]
    case CaseStatus.CLOSED:
      return [CaseStatus.OPEN]
  }
}

export function getInitials(name?: string | null): string {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(part => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
