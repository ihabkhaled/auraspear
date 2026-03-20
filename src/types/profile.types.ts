import type { DashboardDensity, DashboardPanelKey, UserRole } from '@/enums'

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
  data: UserPreferences
}

export interface UserPreferences {
  theme: string
  language: string
  dashboardDensity?: DashboardDensity | undefined
  collapsedDashboardPanels?: DashboardPanelKey[] | undefined
  notificationsEmail?: boolean | undefined
  notificationsInApp?: boolean | undefined
  notifyCriticalAlerts?: boolean | undefined
  notifyHighAlerts?: boolean | undefined
  notifyCaseAssignments?: boolean | undefined
  notifyIncidentUpdates?: boolean | undefined
  notifyComplianceAlerts?: boolean | undefined
  notifyCaseUpdates?: boolean | undefined
  notifyCaseComments?: boolean | undefined
  notifyCaseActivity?: boolean | undefined
  notifyUserManagement?: boolean | undefined
  retentionAlerts?: string | undefined
  retentionLogs?: string | undefined
  retentionIncidents?: string | undefined
  retentionAuditLogs?: string | undefined
}
