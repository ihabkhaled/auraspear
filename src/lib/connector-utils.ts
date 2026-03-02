import { ConnectorAuthType } from '@/enums'
import type { ConnectorRecord } from '@/lib/types/connectors'
import type { ConnectorFormValues } from '@/lib/validation/connectors.schema'

/**
 * Converts a backend `ConnectorRecord` into the form values shape
 * expected by `ConnectorForm`.  The encrypted config field is parsed
 * from JSON when possible; if it fails (encrypted or invalid) we
 * fall back to empty defaults.
 */
export function recordToFormValues(record: ConnectorRecord): ConnectorFormValues {
  let config: Record<string, unknown> = {}
  try {
    const parsed: unknown = JSON.parse(record.encryptedConfig)
    if (parsed && typeof parsed === 'object') {
      config = parsed as Record<string, unknown>
    }
  } catch {
    // config is encrypted or invalid JSON — use empty defaults
  }

  return {
    name: record.name,
    enabled: record.enabled,
    baseUrl: String(config['baseUrl'] ?? ''),
    authType: (Object.values(ConnectorAuthType).includes(
      String(config['authType'] ?? '') as ConnectorAuthType
    )
      ? String(config['authType'])
      : ConnectorAuthType.API_KEY) as ConnectorAuthType,
    apiKey: String(config['apiKey'] ?? ''),
    username: String(config['username'] ?? ''),
    password: String(config['password'] ?? ''),
    token: String(config['token'] ?? ''),
    verifyTLS: config['verifyTLS'] !== false,
    timeoutSeconds: Number(config['timeoutSeconds'] ?? 30) || 30,
    tags: Array.isArray(config['tags']) ? (config['tags'] as string[]).join(', ') : '',
    notes: String(config['notes'] ?? ''),
    managerUrl: String(config['managerUrl'] ?? ''),
    indexerUrl: String(config['indexerUrl'] ?? ''),
    indexerUsername: String(config['indexerUsername'] ?? ''),
    indexerPassword: String(config['indexerPassword'] ?? ''),
    tenant: String(config['tenant'] ?? ''),
    apiUrl: String(config['apiUrl'] ?? ''),
    streamId: String(config['streamId'] ?? ''),
    indexSetId: String(config['indexSetId'] ?? ''),
    orgId: String(config['orgId'] ?? ''),
    clientCert: String(config['clientCert'] ?? ''),
    clientKey: String(config['clientKey'] ?? ''),
    grafanaUrl: String(config['grafanaUrl'] ?? ''),
    folderId: String(config['folderId'] ?? ''),
    datasourceUid: String(config['datasourceUid'] ?? ''),
    org: String(config['org'] ?? ''),
    bucket: String(config['bucket'] ?? ''),
    mispUrl: String(config['mispUrl'] ?? ''),
    mispAuthKey: String(config['mispAuthKey'] ?? ''),
    webhookUrl: String(config['webhookUrl'] ?? ''),
    workflowId: String(config['workflowId'] ?? ''),
    shuffleApiKey: String(config['shuffleApiKey'] ?? ''),
    modelId: String(config['modelId'] ?? ''),
    region: String(config['region'] ?? ''),
    accessKeyId: String(config['accessKeyId'] ?? ''),
    secretAccessKey: String(config['secretAccessKey'] ?? ''),
    nlHuntingEnabled: config['nlHuntingEnabled'] === true,
    explainableAiEnabled: config['explainableAiEnabled'] === true,
    auditLoggingEnabled: config['auditLoggingEnabled'] === true,
  }
}
