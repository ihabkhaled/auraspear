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
