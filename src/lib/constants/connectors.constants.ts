import {
  Shield,
  FileText,
  Crosshair,
  BarChart3,
  Database,
  Radar,
  Zap,
  Brain,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import { ConnectorAuthType, ConnectorCategory, ConnectorStatus, ConnectorType } from '@/enums'
import type { ConnectorMeta, SecurityPosture } from '@/lib/types/connectors'

export const CONNECTOR_TYPES: ConnectorType[] = [
  ConnectorType.WAZUH,
  ConnectorType.GRAYLOG,
  ConnectorType.LOGSTASH,
  ConnectorType.VELOCIRAPTOR,
  ConnectorType.GRAFANA,
  ConnectorType.INFLUXDB,
  ConnectorType.MISP,
  ConnectorType.SHUFFLE,
  ConnectorType.BEDROCK,
]

export const CONNECTOR_ICONS: Record<ConnectorType, LucideIcon> = {
  [ConnectorType.WAZUH]: Shield,
  [ConnectorType.GRAYLOG]: FileText,
  [ConnectorType.LOGSTASH]: Workflow,
  [ConnectorType.VELOCIRAPTOR]: Crosshair,
  [ConnectorType.GRAFANA]: BarChart3,
  [ConnectorType.INFLUXDB]: Database,
  [ConnectorType.MISP]: Radar,
  [ConnectorType.SHUFFLE]: Zap,
  [ConnectorType.BEDROCK]: Brain,
}

export const CONNECTOR_META: Record<ConnectorType, ConnectorMeta> = {
  [ConnectorType.WAZUH]: {
    label: 'Wazuh',
    descriptionKey: 'connectorDesc.wazuh',
    category: ConnectorCategory.SIEM,
  },
  [ConnectorType.GRAYLOG]: {
    label: 'Graylog',
    descriptionKey: 'connectorDesc.graylog',
    category: ConnectorCategory.SIEM,
  },
  [ConnectorType.LOGSTASH]: {
    label: 'Logstash',
    descriptionKey: 'connectorDesc.logstash',
    category: ConnectorCategory.SIEM,
  },
  [ConnectorType.VELOCIRAPTOR]: {
    label: 'Velociraptor',
    descriptionKey: 'connectorDesc.velociraptor',
    category: ConnectorCategory.EDR,
  },
  [ConnectorType.GRAFANA]: {
    label: 'Grafana',
    descriptionKey: 'connectorDesc.grafana',
    category: ConnectorCategory.OBSERVABILITY,
  },
  [ConnectorType.INFLUXDB]: {
    label: 'InfluxDB',
    descriptionKey: 'connectorDesc.influxdb',
    category: ConnectorCategory.OBSERVABILITY,
  },
  [ConnectorType.MISP]: {
    label: 'MISP',
    descriptionKey: 'connectorDesc.misp',
    category: ConnectorCategory.THREAT_INTEL,
  },
  [ConnectorType.SHUFFLE]: {
    label: 'Shuffle SOAR',
    descriptionKey: 'connectorDesc.shuffle',
    category: ConnectorCategory.SOAR,
  },
  [ConnectorType.BEDROCK]: {
    label: 'AWS Bedrock AI',
    descriptionKey: 'connectorDesc.bedrock',
    category: ConnectorCategory.AI,
  },
}

export const CONNECTOR_AUTH_TYPES: ConnectorAuthType[] = [
  ConnectorAuthType.API_KEY,
  ConnectorAuthType.BASIC,
  ConnectorAuthType.BEARER,
  ConnectorAuthType.IAM,
]

export const SECURITY_POSTURE: Record<ConnectorType, SecurityPosture> = {
  [ConnectorType.WAZUH]: { mTLS: true, iam: false, encryption: true },
  [ConnectorType.GRAYLOG]: { mTLS: false, iam: false, encryption: true },
  [ConnectorType.LOGSTASH]: { mTLS: false, iam: false, encryption: true },
  [ConnectorType.VELOCIRAPTOR]: { mTLS: true, iam: false, encryption: true },
  [ConnectorType.GRAFANA]: { mTLS: false, iam: false, encryption: true },
  [ConnectorType.INFLUXDB]: { mTLS: false, iam: false, encryption: true },
  [ConnectorType.MISP]: { mTLS: false, iam: false, encryption: true },
  [ConnectorType.SHUFFLE]: { mTLS: false, iam: false, encryption: true },
  [ConnectorType.BEDROCK]: { mTLS: true, iam: true, encryption: true },
}

export const CONNECTOR_STATUS_STYLES: Record<ConnectorStatus, string> = {
  [ConnectorStatus.NOT_CONFIGURED]: 'bg-muted text-muted-foreground',
  [ConnectorStatus.CONNECTED]: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  [ConnectorStatus.DISCONNECTED]: 'bg-destructive/15 text-destructive',
  [ConnectorStatus.TESTING]: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 animate-pulse',
}

export const CONNECTOR_STATUS_KEYS: Record<ConnectorStatus, string> = {
  [ConnectorStatus.NOT_CONFIGURED]: 'statusNotConfigured',
  [ConnectorStatus.CONNECTED]: 'statusConnected',
  [ConnectorStatus.DISCONNECTED]: 'statusDisconnected',
  [ConnectorStatus.TESTING]: 'statusTesting',
}

export const BEDROCK_MODELS = [
  { id: 'anthropic.claude-3-sonnet', label: 'Claude 3 Sonnet' },
  { id: 'anthropic.claude-3-haiku', label: 'Claude 3 Haiku' },
  { id: 'amazon.titan-text-express', label: 'Titan Text Express' },
  { id: 'meta.llama3-70b-instruct', label: 'Llama 3 70B' },
] as const

export const AWS_REGIONS = [
  { id: 'us-east-1', label: 'US East (N. Virginia)' },
  { id: 'us-west-2', label: 'US West (Oregon)' },
  { id: 'eu-west-1', label: 'EU (Ireland)' },
  { id: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
] as const

export function isConnectorType(value: string): value is ConnectorType {
  return CONNECTOR_TYPES.includes(value as ConnectorType)
}
