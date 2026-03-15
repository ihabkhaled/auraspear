import { ReportType, ReportFormat, ReportStatus } from '@/enums'

export const REPORT_TYPE_LABEL_KEYS: Record<ReportType, string> = {
  [ReportType.EXECUTIVE]: 'typeExecutive',
  [ReportType.COMPLIANCE]: 'typeCompliance',
  [ReportType.INCIDENT]: 'typeIncident',
  [ReportType.THREAT]: 'typeThreat',
  [ReportType.CUSTOM]: 'typeCustom',
}

export const REPORT_TYPE_CLASSES: Record<ReportType, string> = {
  [ReportType.EXECUTIVE]: 'bg-primary text-white',
  [ReportType.COMPLIANCE]: 'bg-status-info text-white',
  [ReportType.INCIDENT]: 'bg-status-error text-white',
  [ReportType.THREAT]: 'bg-status-warning text-white',
  [ReportType.CUSTOM]: 'bg-muted text-muted-foreground',
}

export const REPORT_FORMAT_LABEL_KEYS: Record<ReportFormat, string> = {
  [ReportFormat.PDF]: 'formatPdf',
  [ReportFormat.CSV]: 'formatCsv',
  [ReportFormat.HTML]: 'formatHtml',
}

export const REPORT_FORMAT_CLASSES: Record<ReportFormat, string> = {
  [ReportFormat.PDF]: 'bg-status-error text-white',
  [ReportFormat.CSV]: 'bg-status-success text-white',
  [ReportFormat.HTML]: 'bg-status-info text-white',
}

export const REPORT_STATUS_LABEL_KEYS: Record<ReportStatus, string> = {
  [ReportStatus.GENERATING]: 'statusGenerating',
  [ReportStatus.COMPLETED]: 'statusCompleted',
  [ReportStatus.FAILED]: 'statusFailed',
}

export const REPORT_STATUS_CLASSES: Record<ReportStatus, string> = {
  [ReportStatus.GENERATING]: 'bg-primary text-white',
  [ReportStatus.COMPLETED]: 'bg-status-success text-white',
  [ReportStatus.FAILED]: 'bg-status-error text-white',
}
