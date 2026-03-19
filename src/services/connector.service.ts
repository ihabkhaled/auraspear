import api from '@/lib/api'
import type { ConnectorRecord, ConnectorStats, ConnectorTestResult } from '@/types'

export const connectorService = {
  list: () => api.get<{ data: ConnectorRecord[] }>('/connectors').then(r => r.data.data),

  getByType: (type: string) =>
    api.get<{ data: ConnectorRecord }>(`/connectors/${type}`).then(r => r.data.data),

  getStats: () => api.get<{ data: ConnectorStats }>('/connectors/stats').then(r => r.data.data),

  create: (data: {
    type: string
    name: string
    enabled: boolean
    authType: string
    config: Record<string, unknown>
  }) => api.post<{ data: ConnectorRecord }>('/connectors', data).then(r => r.data.data),

  update: (type: string, data: Record<string, unknown>) =>
    api.patch<{ data: ConnectorRecord }>(`/connectors/${type}`, data).then(r => r.data.data),

  remove: (type: string) => api.delete(`/connectors/${type}`).then(r => r.data),

  test: (type: string) =>
    api.post<{ data: ConnectorTestResult }>(`/connectors/${type}/test`).then(r => r.data.data),

  toggle: (type: string, enabled: boolean) =>
    api
      .post<{ data: ConnectorRecord }>(`/connectors/${type}/toggle`, { enabled })
      .then(r => r.data.data),

  sync: (type: string) =>
    api
      .post<{
        data: { success: boolean; message: string; ingested?: number }
      }>(`/connector-sync/${type}/sync`)
      .then(r => r.data.data),

  getSyncStatus: () =>
    api
      .get<{
        data: Array<{
          type: string
          lastSyncAt: string | null
          syncEnabled: boolean
          enabled: boolean
        }>
      }>('/connector-sync/status')
      .then(r => r.data.data),
}
