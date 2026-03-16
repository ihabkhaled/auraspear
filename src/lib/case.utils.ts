import { BadgeVariant, CaseStatus, type CaseTimelineEntryType } from '@/enums'
import { AVATAR_COLORS, TIMELINE_TYPE_COLORS } from '@/lib/constants/cases'
import { lookup } from '@/lib/utils'

export const STATUS_VARIANT_MAP: Record<CaseStatus, BadgeVariant> = {
  [CaseStatus.OPEN]: BadgeVariant.DEFAULT,
  [CaseStatus.IN_PROGRESS]: BadgeVariant.SECONDARY,
  [CaseStatus.CLOSED]: BadgeVariant.OUTLINE,
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

export function getCaseRowClassName(
  row: { ownerUserId?: string | null },
  currentUserId: string | undefined,
  isAdmin: boolean | undefined
): string {
  if (currentUserId === undefined || isAdmin === true) {
    return ''
  }
  if (row.ownerUserId !== currentUserId) {
    return 'opacity-50'
  }
  return ''
}

export function getInitials(name?: string | null): string {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(part => part.at(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function getAvatarColor(index: number): string {
  return AVATAR_COLORS.at(index % AVATAR_COLORS.length) ?? AVATAR_COLORS.at(0) ?? ''
}

export function getTypeColor(type: CaseTimelineEntryType): string {
  return lookup(TIMELINE_TYPE_COLORS, type) ?? 'var(--muted-foreground)'
}
