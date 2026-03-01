import api from '@/lib/api'
import type { ConnectorType, ConnectorRecord } from '@/lib/types/connectors'
import { useConnectorsStore } from '@/stores/connectors.store'

function timestamp(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19)
}

export async function listConnectors(): Promise<ConnectorRecord[]> {
  try {
    const response = await api.get<{ data: ConnectorRecord[] }>('/connectors')
    return response.data.data ?? []
  } catch {
    // Fallback to store data if backend unavailable
    const state = useConnectorsStore.getState()
    return state.connectorsByTenant[state.activeTenantId] ?? []
  }
}

export function getConnectorByType(type: ConnectorType): ConnectorRecord | undefined {
  return useConnectorsStore.getState().getByType(type)
}

export function upsertConnectorByType(type: ConnectorType, data: Partial<ConnectorRecord>): void {
  useConnectorsStore.getState().upsert(type, data)
}

export function resetConnector(type: ConnectorType): void {
  useConnectorsStore.getState().resetConnector(type)
}

export async function deleteConnector(type: ConnectorType): Promise<void> {
  try {
    await api.delete(`/connectors/${type}`)
  } catch {
    // Fallback to local store
  }
  useConnectorsStore.getState().deleteConnector(type)
}

export async function testConnector(type: ConnectorType): Promise<void> {
  const store = useConnectorsStore.getState()
  const connector = store.getByType(type)
  if (!connector) return

  const logs: string[] = []
  const now = new Date().toISOString()

  store.setStatus(type, 'testing', {
    lastTestAt: connector.lastTestAt ?? '',
    lastTestOk: false,
    lastError: null,
    lastLogs: [],
  })

  logs.push(`[${timestamp()}] Starting connection test...`)

  try {
    // Call the backend test endpoint
    const response = await api.post<{
      data: { type: string; ok: boolean; latencyMs: number; details: string; testedAt: string }
    }>(`/connectors/${type}/test`)

    const result = response.data.data ?? response.data

    logs.push(`[${timestamp()}] Backend response received`)
    logs.push(`[${timestamp()}] Latency: ${result.latencyMs}ms`)
    logs.push(`[${timestamp()}] ${result.details}`)

    if (result.ok) {
      logs.push(`[${timestamp()}] Connection established successfully`)

      // Generate AI audit log for Bedrock
      if (type === 'bedrock') {
        store.addAIAuditLog({
          tenantId: store.activeTenantId,
          model: String(connector.config['modelId'] ?? 'bedrock'),
          action: 'health_check',
          inputTokens: 12,
          outputTokens: 8,
          latencyMs: result.latencyMs,
          status: 'success',
        })
      }

      store.setStatus(type, 'connected', {
        lastTestAt: result.testedAt ?? now,
        lastTestOk: true,
        lastError: null,
        lastLogs: logs,
      })
    } else {
      logs.push(`[${timestamp()}] ERROR: ${result.details}`)
      store.setStatus(type, 'disconnected', {
        lastTestAt: result.testedAt ?? now,
        lastTestOk: false,
        lastError: result.details,
        lastLogs: logs,
      })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Backend unavailable'
    logs.push(`[${timestamp()}] ERROR: ${message}`)
    store.setStatus(type, 'disconnected', {
      lastTestAt: now,
      lastTestOk: false,
      lastError: message,
      lastLogs: logs,
    })
  }
}
