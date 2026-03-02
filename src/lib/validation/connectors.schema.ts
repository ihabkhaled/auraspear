import { z } from 'zod'
import { ConnectorAuthType, ConnectorType } from '@/enums'

const connectorBaseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  enabled: z.boolean(),
  baseUrl: z.string(),
  authType: z.nativeEnum(ConnectorAuthType),
  apiKey: z.string(),
  username: z.string(),
  password: z.string(),
  token: z.string(),
  verifyTLS: z.boolean(),
  timeoutSeconds: z.number().min(1, 'Min 1 second').max(120, 'Max 120 seconds'),
  tags: z.string(),
  notes: z.string(),
  // Wazuh
  managerUrl: z.string(),
  indexerUrl: z.string(),
  indexerUsername: z.string(),
  indexerPassword: z.string(),
  tenant: z.string(),
  // Graylog + Velociraptor
  apiUrl: z.string(),
  streamId: z.string(),
  indexSetId: z.string(),
  // Velociraptor
  orgId: z.string(),
  clientCert: z.string(),
  clientKey: z.string(),
  // Grafana
  grafanaUrl: z.string(),
  folderId: z.string(),
  datasourceUid: z.string(),
  // InfluxDB
  org: z.string(),
  bucket: z.string(),
  // MISP
  mispUrl: z.string(),
  mispAuthKey: z.string(),
  // Shuffle
  webhookUrl: z.string(),
  workflowId: z.string(),
  shuffleApiKey: z.string(),
  // Bedrock
  modelId: z.string(),
  region: z.string(),
  accessKeyId: z.string(),
  secretAccessKey: z.string(),
  nlHuntingEnabled: z.boolean(),
  explainableAiEnabled: z.boolean(),
  auditLoggingEnabled: z.boolean(),
})

export type ConnectorFormValues = z.infer<typeof connectorBaseSchema>

export function getConnectorSchema(type: ConnectorType) {
  return connectorBaseSchema.superRefine((data, ctx) => {
    // baseUrl format (not needed for Bedrock which uses region-based endpoints)
    if (
      type !== ConnectorType.BEDROCK &&
      data.baseUrl &&
      !data.baseUrl.startsWith('http://') &&
      !data.baseUrl.startsWith('https://')
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'URL must start with http:// or https://',
        path: ['baseUrl'],
      })
    }

    // Auth + per-tool fields only enforced when baseUrl is provided (or always for Bedrock)
    const shouldValidateFields = type === ConnectorType.BEDROCK || Boolean(data.baseUrl)

    if (shouldValidateFields) {
      // Standard auth validation (skip for Bedrock which uses IAM)
      if (type !== ConnectorType.BEDROCK) {
        if (data.authType === ConnectorAuthType.API_KEY && !data.apiKey) {
          ctx.addIssue({ code: 'custom', message: 'API key is required', path: ['apiKey'] })
        }
        if (data.authType === ConnectorAuthType.BASIC && !data.username) {
          ctx.addIssue({ code: 'custom', message: 'Username is required', path: ['username'] })
        }
        if (data.authType === ConnectorAuthType.BASIC && !data.password) {
          ctx.addIssue({ code: 'custom', message: 'Password is required', path: ['password'] })
        }
        if (data.authType === ConnectorAuthType.BEARER && !data.token) {
          ctx.addIssue({ code: 'custom', message: 'Token is required', path: ['token'] })
        }
      }

      // Per-tool required fields
      if (type === ConnectorType.WAZUH && !data.indexerUrl) {
        ctx.addIssue({ code: 'custom', message: 'Indexer URL is required', path: ['indexerUrl'] })
      }
      if (type === ConnectorType.GRAYLOG && !data.apiUrl) {
        ctx.addIssue({ code: 'custom', message: 'API URL is required', path: ['apiUrl'] })
      }
      if (type === ConnectorType.VELOCIRAPTOR && !data.apiUrl) {
        ctx.addIssue({ code: 'custom', message: 'API URL is required', path: ['apiUrl'] })
      }
      if (type === ConnectorType.GRAFANA && !data.grafanaUrl) {
        ctx.addIssue({ code: 'custom', message: 'Grafana URL is required', path: ['grafanaUrl'] })
      }
      if (type === ConnectorType.INFLUXDB) {
        if (!data.org) {
          ctx.addIssue({ code: 'custom', message: 'Organization is required', path: ['org'] })
        }
        if (!data.bucket) {
          ctx.addIssue({ code: 'custom', message: 'Bucket is required', path: ['bucket'] })
        }
        if (!data.token) {
          ctx.addIssue({ code: 'custom', message: 'Token is required', path: ['token'] })
        }
      }
      if (type === ConnectorType.MISP) {
        if (!data.mispUrl) {
          ctx.addIssue({ code: 'custom', message: 'MISP URL is required', path: ['mispUrl'] })
        }
        if (!data.mispAuthKey) {
          ctx.addIssue({ code: 'custom', message: 'Auth key is required', path: ['mispAuthKey'] })
        }
      }
      if (type === ConnectorType.SHUFFLE) {
        if (!data.webhookUrl) {
          ctx.addIssue({ code: 'custom', message: 'Webhook URL is required', path: ['webhookUrl'] })
        }
        if (!data.workflowId) {
          ctx.addIssue({ code: 'custom', message: 'Workflow ID is required', path: ['workflowId'] })
        }
      }
      if (type === ConnectorType.BEDROCK) {
        if (!data.modelId) {
          ctx.addIssue({ code: 'custom', message: 'Model is required', path: ['modelId'] })
        }
        if (!data.region) {
          ctx.addIssue({ code: 'custom', message: 'Region is required', path: ['region'] })
        }
      }
    }
  })
}
