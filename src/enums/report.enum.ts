export enum ReportType {
  EXECUTIVE = 'executive',
  COMPLIANCE = 'compliance',
  INCIDENT = 'incident',
  THREAT = 'threat',
  CUSTOM = 'custom',
}

export enum ReportFormat {
  PDF = 'pdf',
  CSV = 'csv',
  HTML = 'html',
}

export enum ReportStatus {
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
