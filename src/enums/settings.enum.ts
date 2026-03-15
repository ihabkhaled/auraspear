export enum NotificationCategory {
  CRITICAL_ALERTS = 'criticalAlerts',
  HIGH_ALERTS = 'highAlerts',
  CASE_ASSIGNMENTS = 'caseAssignments',
  INCIDENT_UPDATES = 'incidentUpdates',
  COMPLIANCE_ALERTS = 'complianceAlerts',
}

export enum RetentionPeriod {
  DAYS_30 = '30',
  DAYS_90 = '90',
  DAYS_180 = '180',
  DAYS_365 = '365',
  UNLIMITED = 'unlimited',
}
