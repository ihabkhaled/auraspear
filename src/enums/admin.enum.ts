export enum UserRole {
  GLOBAL_ADMIN = 'GLOBAL_ADMIN',
  TENANT_ADMIN = 'TENANT_ADMIN',
  SOC_ANALYST_L2 = 'SOC_ANALYST_L2',
  SOC_ANALYST_L1 = 'SOC_ANALYST_L1',
  THREAT_HUNTER = 'THREAT_HUNTER',
  EXECUTIVE_READONLY = 'EXECUTIVE_READONLY',
}

export enum ServiceStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  DOWN = 'down',
  MAINTENANCE = 'maintenance',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum TenantStatus {
  ACTIVE = 'active',
  TRIAL = 'trial',
  INACTIVE = 'inactive',
}

export enum ThemePreference {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export enum SupportedLocale {
  EN = 'en',
  ES = 'es',
  FR = 'fr',
  AR = 'ar',
  IT = 'it',
  DE = 'de',
}
