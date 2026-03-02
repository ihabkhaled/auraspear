import type { UserRole } from '@/enums'

export interface UserProfile {
  id: string
  email: string
  name: string
  role: UserRole
  tenantId: string
  tenantSlug: string
  createdAt: string
  updatedAt: string
}

export interface UpdateProfileInput {
  name: string
  currentPassword: string
}

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface PreferencesResponse {
  data: Record<string, unknown>
}
