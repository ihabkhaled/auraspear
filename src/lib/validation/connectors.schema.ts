import { z } from 'zod'
import { ConnectorAuthType, ConnectorType } from '@/enums'

const connectorBaseSchema = z.object({
  name: z.string(),
  enabled: z.boolean(),
  baseUrl: z.string(),
  authType: z.nativeEnum(ConnectorAuthType),
  apiKey: z.string(),
  username: z.string(),
  password: z.string(),
  token: z.string(),
  verifyTLS: z.boolean(),
  timeoutSeconds: z.number(),
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
  // Logstash
  pipelineId: z.string(),
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
    if (!data.name) {
      ctx.addIssue({ code: 'custom', message: 'nameRequired', path: ['name'] })
    }

    if (
      type !== ConnectorType.BEDROCK &&
      data.baseUrl &&
      !data.baseUrl.startsWith('http://') &&
      !data.baseUrl.startsWith('https://')
    ) {
      ctx.addIssue({ code: 'custom', message: 'urlFormat', path: ['baseUrl'] })
    }

    if (data.timeoutSeconds < 1) {
      ctx.addIssue({ code: 'custom', message: 'minTimeout', path: ['timeoutSeconds'] })
    }
    if (data.timeoutSeconds > 120) {
      ctx.addIssue({ code: 'custom', message: 'maxTimeout', path: ['timeoutSeconds'] })
    }

    const shouldValidateFields = type === ConnectorType.BEDROCK || Boolean(data.baseUrl)

    if (shouldValidateFields) {
      if (type !== ConnectorType.BEDROCK) {
        if (data.authType === ConnectorAuthType.API_KEY && !data.apiKey) {
          ctx.addIssue({ code: 'custom', message: 'apiKeyRequired', path: ['apiKey'] })
        }
        if (data.authType === ConnectorAuthType.BASIC && !data.username) {
          ctx.addIssue({ code: 'custom', message: 'usernameRequired', path: ['username'] })
        }
        if (data.authType === ConnectorAuthType.BASIC && !data.password) {
          ctx.addIssue({ code: 'custom', message: 'passwordRequired', path: ['password'] })
        }
        if (data.authType === ConnectorAuthType.BEARER && !data.token) {
          ctx.addIssue({ code: 'custom', message: 'tokenRequired', path: ['token'] })
        }
      }

      if (type === ConnectorType.WAZUH && !data.indexerUrl) {
        ctx.addIssue({ code: 'custom', message: 'indexerUrlRequired', path: ['indexerUrl'] })
      }
      if (type === ConnectorType.GRAYLOG && !data.apiUrl) {
        ctx.addIssue({ code: 'custom', message: 'apiUrlRequired', path: ['apiUrl'] })
      }
      if (type === ConnectorType.VELOCIRAPTOR && !data.apiUrl) {
        ctx.addIssue({ code: 'custom', message: 'apiUrlRequired', path: ['apiUrl'] })
      }
      if (type === ConnectorType.GRAFANA && !data.grafanaUrl) {
        ctx.addIssue({ code: 'custom', message: 'grafanaUrlRequired', path: ['grafanaUrl'] })
      }
      if (type === ConnectorType.INFLUXDB) {
        if (!data.org) {
          ctx.addIssue({ code: 'custom', message: 'organizationRequired', path: ['org'] })
        }
        if (!data.bucket) {
          ctx.addIssue({ code: 'custom', message: 'bucketRequired', path: ['bucket'] })
        }
        if (!data.token) {
          ctx.addIssue({ code: 'custom', message: 'tokenRequired', path: ['token'] })
        }
      }
      if (type === ConnectorType.MISP) {
        if (!data.mispUrl) {
          ctx.addIssue({ code: 'custom', message: 'mispUrlRequired', path: ['mispUrl'] })
        }
        if (!data.mispAuthKey) {
          ctx.addIssue({ code: 'custom', message: 'authKeyRequired', path: ['mispAuthKey'] })
        }
      }
      if (type === ConnectorType.SHUFFLE) {
        if (!data.webhookUrl) {
          ctx.addIssue({ code: 'custom', message: 'webhookUrlRequired', path: ['webhookUrl'] })
        }
        if (!data.workflowId) {
          ctx.addIssue({ code: 'custom', message: 'workflowIdRequired', path: ['workflowId'] })
        }
      }
      if (type === ConnectorType.BEDROCK) {
        if (!data.modelId) {
          ctx.addIssue({ code: 'custom', message: 'modelRequired', path: ['modelId'] })
        }
        if (!data.region) {
          ctx.addIssue({ code: 'custom', message: 'regionRequired', path: ['region'] })
        }
      }
    }
  })
}
