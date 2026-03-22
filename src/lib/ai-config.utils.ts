import { AiOutputFormat, AiTriggerMode, OsintAuthType, OsintSourceType } from '@/enums'
import type { OsintSourceConfig, TenantAgentConfig } from '@/types'

export function deriveAgentConfigState(config: TenantAgentConfig | null) {
  if (!config) {
    return {
      enabled: false,
      providerMode: 'inherit',
      model: '',
      temperature: '0.7',
      maxTokens: '4096',
      triggerMode: AiTriggerMode.MANUAL_ONLY,
      outputFormat: AiOutputFormat.MARKDOWN,
      presentationSkills: false,
      systemPrompt: '',
      promptSuffix: '',
      indexPatterns: '',
      tokensPerHourLimit: '10000',
      tokensPerDayLimit: '100000',
      tokensPerMonthLimit: '1000000',
      maxConcurrentRuns: '3',
    }
  }

  return {
    enabled: config.isEnabled,
    providerMode: config.providerMode,
    model: config.model ?? '',
    temperature: String(config.temperature),
    maxTokens: String(config.maxTokensPerCall),
    triggerMode: config.triggerMode as AiTriggerMode,
    outputFormat: config.outputFormat as AiOutputFormat,
    presentationSkills: (config.presentationSkills ?? []).length > 0,
    systemPrompt: config.systemPrompt ?? '',
    promptSuffix: config.promptSuffix ?? '',
    indexPatterns: (config.indexPatterns ?? []).join(', '),
    tokensPerHourLimit: String(config.tokensPerHour),
    tokensPerDayLimit: String(config.tokensPerDay),
    tokensPerMonthLimit: String(config.tokensPerMonth),
    maxConcurrentRuns: String(config.maxConcurrentRuns),
  }
}

export function deriveOsintSourceState(source: OsintSourceConfig | null) {
  if (!source) {
    return {
      sourceType: OsintSourceType.VIRUSTOTAL,
      name: '',
      apiKey: '',
      baseUrl: '',
      authType: OsintAuthType.API_KEY_HEADER,
      headerName: '',
      queryParam: '',
      responsePath: '',
      requestMethod: 'GET',
      timeout: '30000',
    }
  }

  return {
    sourceType: source.sourceType,
    name: source.name,
    apiKey: '',
    baseUrl: source.baseUrl ?? '',
    authType: source.authType,
    headerName: source.headerName ?? '',
    queryParam: source.queryParamName ?? '',
    responsePath: source.responsePath ?? '',
    requestMethod: source.requestMethod,
    timeout: String(source.timeout),
  }
}
