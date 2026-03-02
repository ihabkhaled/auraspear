import { CaseStatus } from '@/enums'

export const STATUS_VARIANT_MAP: Record<CaseStatus, 'default' | 'secondary' | 'outline'> = {
  [CaseStatus.OPEN]: 'default',
  [CaseStatus.IN_PROGRESS]: 'secondary',
  [CaseStatus.CLOSED]: 'outline',
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
