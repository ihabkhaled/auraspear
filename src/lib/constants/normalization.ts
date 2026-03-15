import { NormalizationPipelineStatus, NormalizationSourceType } from '@/enums'

export const NORMALIZATION_SOURCE_TYPE_LABEL_KEYS: Record<NormalizationSourceType, string> = {
  [NormalizationSourceType.SYSLOG]: 'sourceSyslog',
  [NormalizationSourceType.WINDOWS_EVENT]: 'sourceWindowsEvent',
  [NormalizationSourceType.CEF]: 'sourceCef',
  [NormalizationSourceType.LEEF]: 'sourceLeef',
  [NormalizationSourceType.JSON]: 'sourceJson',
  [NormalizationSourceType.CSV]: 'sourceCsv',
  [NormalizationSourceType.CUSTOM]: 'sourceCustom',
}

export const NORMALIZATION_PIPELINE_STATUS_LABEL_KEYS: Record<NormalizationPipelineStatus, string> =
  {
    [NormalizationPipelineStatus.ACTIVE]: 'statusActive',
    [NormalizationPipelineStatus.INACTIVE]: 'statusInactive',
    [NormalizationPipelineStatus.ERROR]: 'statusError',
    [NormalizationPipelineStatus.DRAFT]: 'statusDraft',
  }

export const NORMALIZATION_PIPELINE_STATUS_CLASSES: Record<NormalizationPipelineStatus, string> = {
  [NormalizationPipelineStatus.ACTIVE]: 'bg-status-success text-white',
  [NormalizationPipelineStatus.INACTIVE]: 'bg-muted text-muted-foreground',
  [NormalizationPipelineStatus.ERROR]: 'bg-status-error text-white',
  [NormalizationPipelineStatus.DRAFT]: 'bg-status-info text-white',
}
