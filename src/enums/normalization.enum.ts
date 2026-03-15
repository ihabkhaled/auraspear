export enum NormalizationSourceType {
  SYSLOG = 'syslog',
  WINDOWS_EVENT = 'windows_event',
  CEF = 'cef',
  LEEF = 'leef',
  JSON = 'json',
  CSV = 'csv',
  CUSTOM = 'custom',
}

export enum NormalizationPipelineStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
  DRAFT = 'draft',
}
