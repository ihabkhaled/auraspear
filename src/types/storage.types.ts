export interface AuthStorageState {
  state?: {
    accessToken?: string
    refreshToken?: string
    isAuthenticated?: boolean
    user?: { tenantId?: string }
  }
}

export interface TenantStorageState {
  state?: {
    currentTenantId?: string
  }
}
