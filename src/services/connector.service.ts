import api from '@/lib/api'
import type { ConnectorRecord, ConnectorTestResult } from '@/lib/types/connectors'

export const connectorService = {
  list: () => api.get<{ data: ConnectorRecord[] }>('/connectors').then(r => r.data.data),

  getByType: (type: string) =>
    api.get<{ data: ConnectorRecord }>(`/connectors/${type}`).then(r => r.data.data),

  create: (data: { type: string; name: string; authType: string; encryptedConfig: string }) =>
    api.post<{ data: ConnectorRecord }>('/connectors', data).then(r => r.data.data),

  update: (type: string, data: Record<string, unknown>) =>
    api.patch<{ data: ConnectorRecord }>(`/connectors/${type}`, data).then(r => r.data.data),

  remove: (type: string) => api.delete(`/connectors/${type}`).then(r => r.data),

  test: (type: string) =>
    api.post<{ data: ConnectorTestResult }>(`/connectors/${type}/test`).then(r => r.data.data),

  toggle: (type: string, enabled: boolean) =>
    api
      .post<{ data: ConnectorRecord }>(`/connectors/${type}/toggle`, { enabled })
      .then(r => r.data.data),
}
