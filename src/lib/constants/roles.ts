import { UserRole } from '@/enums'

export const ROLE_LABEL_KEYS: Record<UserRole, string> = {
  [UserRole.GLOBAL_ADMIN]: 'globalAdmin',
  [UserRole.TENANT_ADMIN]: 'tenantAdmin',
  [UserRole.SOC_ANALYST_L2]: 'socAnalystL2',
  [UserRole.SOC_ANALYST_L1]: 'socAnalystL1',
  [UserRole.THREAT_HUNTER]: 'threatHunter',
  [UserRole.EXECUTIVE_READONLY]: 'executiveReadonly',
}
