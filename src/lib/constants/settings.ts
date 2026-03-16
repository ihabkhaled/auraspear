import type { NotificationCategory } from '@/enums'
import type { DataRetentionConfig } from '@/types'

export const RETENTION_FIELDS: Array<{
  key: keyof DataRetentionConfig
  labelKey: string
  descriptionKey: string
}> = [
  {
    key: 'alertRetention',
    labelKey: 'alertRetention',
    descriptionKey: 'alertRetentionDescription',
  },
  {
    key: 'logRetention',
    labelKey: 'logRetention',
    descriptionKey: 'logRetentionDescription',
  },
  {
    key: 'incidentRetention',
    labelKey: 'incidentRetention',
    descriptionKey: 'incidentRetentionDescription',
  },
  {
    key: 'auditLogRetention',
    labelKey: 'auditLogRetention',
    descriptionKey: 'auditLogRetentionDescription',
  },
]

export const CATEGORY_LABEL_KEYS: Record<NotificationCategory, string> = {
  criticalAlerts: 'criticalAlerts',
  highAlerts: 'highAlerts',
  caseAssignments: 'caseAssignments',
  caseUpdates: 'caseUpdates',
  caseComments: 'caseComments',
  caseActivity: 'caseActivity',
  incidentUpdates: 'incidentUpdates',
  complianceAlerts: 'complianceAlerts',
  userManagement: 'userManagement',
}

export const CATEGORY_DESCRIPTION_KEYS: Record<NotificationCategory, string> = {
  criticalAlerts: 'criticalAlertsDescription',
  highAlerts: 'highAlertsDescription',
  caseAssignments: 'caseAssignmentsDescription',
  caseUpdates: 'caseUpdatesDescription',
  caseComments: 'caseCommentsDescription',
  caseActivity: 'caseActivityDescription',
  incidentUpdates: 'incidentUpdatesDescription',
  complianceAlerts: 'complianceAlertsDescription',
  userManagement: 'userManagementDescription',
}
