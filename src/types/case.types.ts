import type {
  CaseArtifactType,
  CaseSeverity,
  CaseStatus,
  CaseTaskStatus,
  CaseTimelineEntryType,
} from '@/enums'

export interface CaseTask {
  id: string
  title: string
  status: CaseTaskStatus
  assignee: string
}

export interface CaseTimelineEntry {
  id: string
  timestamp: string
  type: CaseTimelineEntryType
  actor: string
  description: string
  metadata?: Record<string, unknown>
}

export interface CaseArtifact {
  id: string
  type: CaseArtifactType
  value: string
  source: string
}

export interface Case {
  id: string
  caseNumber: string
  title: string
  description: string
  status: CaseStatus
  severity: CaseSeverity
  assignee: string
  createdAt: string
  updatedAt: string
  closedAt?: string
  linkedAlertIds: string[]
  timeline: CaseTimelineEntry[]
  tasks: CaseTask[]
  artifacts: CaseArtifact[]
  tenantId: string
}

export interface CreateCaseInput {
  title: string
  description: string
  severity: CaseSeverity
  assignee: string
  linkedAlertIds?: string[]
}

export interface UpdateCaseInput {
  title?: string
  description?: string
  severity?: CaseSeverity
  assignee?: string
  status?: CaseStatus
  linkedAlertIds?: string[]
}

export interface CaseSearchParams {
  page?: number
  limit?: number
  status?: string
  severity?: string
  query?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
