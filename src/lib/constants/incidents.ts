import { IncidentCategory, IncidentSeverity, IncidentStatus } from '@/enums'

export const INCIDENT_STATUS_LABEL_KEYS: Record<IncidentStatus, string> = {
  [IncidentStatus.OPEN]: 'statusOpen',
  [IncidentStatus.IN_PROGRESS]: 'statusInProgress',
  [IncidentStatus.CONTAINED]: 'statusContained',
  [IncidentStatus.RESOLVED]: 'statusResolved',
  [IncidentStatus.CLOSED]: 'statusClosed',
}

export const INCIDENT_STATUS_CLASSES: Record<IncidentStatus, string> = {
  [IncidentStatus.OPEN]: 'bg-status-info text-white',
  [IncidentStatus.IN_PROGRESS]: 'bg-primary text-white',
  [IncidentStatus.CONTAINED]: 'bg-status-warning text-white',
  [IncidentStatus.RESOLVED]: 'bg-status-success text-white',
  [IncidentStatus.CLOSED]: 'bg-muted text-muted-foreground',
}

export const INCIDENT_SEVERITY_LABEL_KEYS: Record<IncidentSeverity, string> = {
  [IncidentSeverity.CRITICAL]: 'severityCritical',
  [IncidentSeverity.HIGH]: 'severityHigh',
  [IncidentSeverity.MEDIUM]: 'severityMedium',
  [IncidentSeverity.LOW]: 'severityLow',
}

export const INCIDENT_SEVERITY_CLASSES: Record<IncidentSeverity, string> = {
  [IncidentSeverity.CRITICAL]: 'bg-severity-critical text-white',
  [IncidentSeverity.HIGH]: 'bg-severity-high text-white',
  [IncidentSeverity.MEDIUM]: 'bg-severity-medium text-white',
  [IncidentSeverity.LOW]: 'bg-severity-low text-white',
}

export const INCIDENT_CATEGORY_LABEL_KEYS: Record<IncidentCategory, string> = {
  [IncidentCategory.INTRUSION]: 'categoryIntrusion',
  [IncidentCategory.INSIDER]: 'categoryInsider',
  [IncidentCategory.BRUTE_FORCE]: 'categoryBruteForce',
  [IncidentCategory.EXFILTRATION]: 'categoryExfiltration',
  [IncidentCategory.MALWARE]: 'categoryMalware',
  [IncidentCategory.CLOUD]: 'categoryCloud',
  [IncidentCategory.PHISHING]: 'categoryPhishing',
  [IncidentCategory.DOS]: 'categoryDos',
  [IncidentCategory.OTHER]: 'categoryOther',
}

export const INCIDENT_VALID_TRANSITIONS: Record<IncidentStatus, IncidentStatus[]> = {
  [IncidentStatus.OPEN]: [IncidentStatus.IN_PROGRESS, IncidentStatus.CLOSED],
  [IncidentStatus.IN_PROGRESS]: [
    IncidentStatus.CONTAINED,
    IncidentStatus.RESOLVED,
    IncidentStatus.CLOSED,
  ],
  [IncidentStatus.CONTAINED]: [
    IncidentStatus.RESOLVED,
    IncidentStatus.IN_PROGRESS,
    IncidentStatus.CLOSED,
  ],
  [IncidentStatus.RESOLVED]: [IncidentStatus.CLOSED, IncidentStatus.IN_PROGRESS],
  [IncidentStatus.CLOSED]: [IncidentStatus.OPEN],
}

export const INCIDENT_ACTOR_TYPE_CLASSES: Record<string, string> = {
  user: 'bg-status-info text-white',
  ai_agent: 'bg-primary text-white',
  system: 'bg-muted text-muted-foreground',
}

export const INCIDENT_TIMELINE_DOT_CLASSES: Record<string, string> = {
  user: 'bg-status-info',
  ai_agent: 'bg-primary',
  system: 'bg-muted-foreground',
}
