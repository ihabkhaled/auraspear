import type { UserRole } from '@/enums'

export interface AuthUser {
  sub: string
  email: string
  tenantId: string
  tenantSlug: string
  role: UserRole
}

export interface LoginRequest {
  email: string
  password: string
}

export interface TenantMembershipInfo {
  id: string
  name: string
  slug: string
  role: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
  tenants: TenantMembershipInfo[]
}

export interface RefreshResponse {
  accessToken: string
  refreshToken: string
}

export interface BackendLoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    sub: string
    email: string
    tenantId: string
    tenantSlug: string
    role: string
  }
}

export interface ImpersonationInfo {
  sub: string
  email: string
  role: string
  tenantId: string
  tenantSlug: string
}

export interface ImpersonateResponse {
  accessToken: string
  refreshToken: string
  user: {
    sub: string
    email: string
    tenantId: string
    tenantSlug: string
    role: string
  }
  impersonator: ImpersonationInfo
}

export interface EndImpersonationResponse {
  accessToken: string
  refreshToken: string
  user: {
    sub: string
    email: string
    tenantId: string
    tenantSlug: string
    role: string
  }
}

export interface BackendLoginWithTenants extends BackendLoginResponse {
  tenants: TenantMembershipInfo[]
}

export interface BackendRefreshResponse {
  accessToken: string
  refreshToken: string
}
