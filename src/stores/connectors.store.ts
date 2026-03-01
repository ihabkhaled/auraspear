import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CONNECTOR_TYPES, DEMO_TENANTS } from '@/lib/types/connectors'
import type {
  ConnectorType,
  ConnectorRecord,
  ConnectorStatus,
  RBACRole,
  AuditLogEntry,
  AIAuditEntry,
} from '@/lib/types/connectors'

function defaultConfig(): Record<string, unknown> {
  return {
    baseUrl: '',
    authType: 'apiKey',
    apiKey: '',
    username: '',
    password: '',
    token: '',
    verifyTLS: true,
    timeoutSeconds: 30,
    tags: [],
    notes: '',
    mispUrl: '',
    mispAuthKey: '',
    webhookUrl: '',
    workflowId: '',
    shuffleApiKey: '',
    modelId: '',
    region: '',
    accessKeyId: '',
    secretAccessKey: '',
    nlHuntingEnabled: false,
    explainableAiEnabled: false,
    auditLoggingEnabled: false,
  }
}

interface ConnectorsState {
  connectorsByTenant: Record<string, ConnectorRecord[]>
  activeTenantId: string
  role: RBACRole
  auditLogs: AuditLogEntry[]
  aiAuditLogs: AIAuditEntry[]

  connectors: ConnectorRecord[]
  getByType: (type: ConnectorType) => ConnectorRecord | undefined

  setActiveTenant: (id: string) => void
  setRole: (role: RBACRole) => void

  upsert: (type: ConnectorType, data: Partial<ConnectorRecord>) => void
  setStatus: (
    type: ConnectorType,
    status: ConnectorStatus,
    extra?: {
      lastTestAt: string
      lastTestOk: boolean
      lastError: string | null
      lastLogs: string[]
    }
  ) => void
  resetConnector: (type: ConnectorType) => void
  deleteConnector: (type: ConnectorType) => void

  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void
  addAIAuditLog: (entry: Omit<AIAuditEntry, 'id' | 'timestamp'>) => void
  seedDefaults: () => void
}

export const useConnectorsStore = create<ConnectorsState>()(
  persist(
    (set, get) => ({
      connectorsByTenant: {},
      activeTenantId: '',
      role: 'Admin' as RBACRole,
      auditLogs: [],
      aiAuditLogs: [],

      get connectors() {
        const state = get()
        return state.connectorsByTenant[state.activeTenantId] ?? []
      },

      getByType: type => {
        const state = get()
        const list = state.connectorsByTenant[state.activeTenantId] ?? []
        return list.find(c => c.type === type)
      },

      setActiveTenant: id => set({ activeTenantId: id }),
      setRole: role => set({ role }),

      upsert: (type, data) =>
        set(state => {
          const tid = state.activeTenantId
          const list = state.connectorsByTenant[tid] ?? []
          return {
            connectorsByTenant: {
              ...state.connectorsByTenant,
              [tid]: list.map(c =>
                c.type === type ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
              ),
            },
          }
        }),

      setStatus: (type, status, extra) =>
        set(state => {
          const tid = state.activeTenantId
          const list = state.connectorsByTenant[tid] ?? []
          return {
            connectorsByTenant: {
              ...state.connectorsByTenant,
              [tid]: list.map(c =>
                c.type === type
                  ? {
                      ...c,
                      status,
                      lastTestAt: extra ? extra.lastTestAt : c.lastTestAt,
                      lastTestOk: extra ? extra.lastTestOk : c.lastTestOk,
                      lastError: extra ? extra.lastError : c.lastError,
                      lastLogs: extra ? extra.lastLogs : c.lastLogs,
                      updatedAt: new Date().toISOString(),
                    }
                  : c
              ),
            },
          }
        }),

      resetConnector: type =>
        set(state => {
          const tid = state.activeTenantId
          const list = state.connectorsByTenant[tid] ?? []
          return {
            connectorsByTenant: {
              ...state.connectorsByTenant,
              [tid]: list.map(c =>
                c.type === type
                  ? {
                      ...c,
                      enabled: false,
                      config: defaultConfig(),
                      status: 'not_configured' as ConnectorStatus,
                      lastTestAt: null,
                      lastTestOk: null,
                      lastError: null,
                      lastLogs: [],
                      updatedAt: new Date().toISOString(),
                    }
                  : c
              ),
            },
          }
        }),

      deleteConnector: type =>
        set(state => {
          const tid = state.activeTenantId
          const list = state.connectorsByTenant[tid] ?? []
          return {
            connectorsByTenant: {
              ...state.connectorsByTenant,
              [tid]: list.filter(c => c.type !== type),
            },
          }
        }),

      addAuditLog: entry =>
        set(state => ({
          auditLogs: [
            { ...entry, id: crypto.randomUUID(), timestamp: new Date().toISOString() },
            ...state.auditLogs,
          ],
        })),

      addAIAuditLog: entry =>
        set(state => ({
          aiAuditLogs: [
            { ...entry, id: crypto.randomUUID(), timestamp: new Date().toISOString() },
            ...state.aiAuditLogs,
          ],
        })),

      seedDefaults: () =>
        set(() => {
          const now = new Date().toISOString()
          const byTenant: Record<string, ConnectorRecord[]> = {}

          for (const tenant of DEMO_TENANTS) {
            byTenant[tenant.id] = CONNECTOR_TYPES.map(type => ({
              id: `${tenant.id}-${type}`,
              type,
              name: type,
              enabled: false,
              config: defaultConfig(),
              status: 'not_configured' as ConnectorStatus,
              lastTestAt: null,
              lastTestOk: null,
              lastError: null,
              lastLogs: [],
              tenantId: tenant.id,
              createdAt: now,
              updatedAt: now,
            }))
          }

          return {
            connectorsByTenant: byTenant,
            activeTenantId: DEMO_TENANTS[0].id,
            auditLogs: [],
            aiAuditLogs: [],
          }
        }),
    }),
    {
      name: 'auraspear-connectors',
    }
  )
)
