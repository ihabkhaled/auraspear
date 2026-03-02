import { UserRole } from '@/enums'

export function getStatusDotClass(
  isActive: boolean,
  isBlocked: boolean,
  isDeleted: boolean
): string {
  if (isActive) return 'bg-status-success'
  if (isBlocked) return 'bg-status-warning'
  if (isDeleted) return 'bg-status-error'
  return 'bg-status-neutral'
}

export function getRoleBadgeClass(role: UserRole): string {
  switch (role) {
    case UserRole.GLOBAL_ADMIN:
    case UserRole.TENANT_ADMIN: {
      return 'bg-primary/10 text-primary border-primary/20'
    }
    case UserRole.SOC_ANALYST_L2:
    case UserRole.SOC_ANALYST_L1: {
      return 'bg-[var(--chart-1)]/10 text-[var(--chart-1)] border-[var(--chart-1)]/20'
    }
    case UserRole.THREAT_HUNTER: {
      return 'bg-[var(--chart-3)]/10 text-[var(--chart-3)] border-[var(--chart-3)]/20'
    }
    case UserRole.EXECUTIVE_READONLY:
    default: {
      return 'bg-muted text-muted-foreground border-border'
    }
  }
}
