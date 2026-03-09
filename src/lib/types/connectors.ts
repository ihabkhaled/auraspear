import { type ConnectorAuthType, type ConnectorCategory, type ConnectorType } from '@/enums'
import type { LucideIcon } from 'lucide-react'

/** Backend connector response shape (from ConnectorConfig Prisma model) */
export interface ConnectorRecord {
  id: string
  type: ConnectorType
  name: string
  enabled: boolean
  authType: ConnectorAuthType
  encryptedConfig: string
  lastTestAt: string | null
  lastTestOk: boolean | null
  lastError: string | null
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface ConnectorTestResult {
  type: string
  ok: boolean
  latencyMs: number
  details: string
  testedAt: string
}

export interface ConnectorMeta {
  label: string
  descriptionKey: string
  category: ConnectorCategory
}

export interface SecurityPosture {
  mTLS: boolean
  iam: boolean
  encryption: boolean
}

export interface ConnectorIcon {
  type: ConnectorType
  icon: LucideIcon
}
