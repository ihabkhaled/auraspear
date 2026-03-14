import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { explorerService } from '@/services'
import { useTenantStore } from '@/stores'
import type {
  GraylogSearchParams,
  GrafanaDashboardSearchParams,
  InfluxDBQueryParams,
  MispExplorerSearchParams,
  LogstashLogSearchParams,
  VelociraptorEndpointSearchParams,
  VelociraptorHuntSearchParams,
  ShuffleWorkflowSearchParams,
  SyncJobSearchParams,
  TriggerSyncInput,
} from '@/types'

// ── Overview ─────────────────────────────────────────────────────────

export function useExplorerOverview() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['explorer', tenantId, 'overview'],
    queryFn: () => explorerService.getOverview(),
  })
}

// ── Graylog ──────────────────────────────────────────────────────────

export function useGraylogLogs(params?: GraylogSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['explorer', tenantId, 'graylog', 'logs', params],
    queryFn: () => explorerService.searchGraylogLogs(params),
    placeholderData: keepPreviousData,
  })
}

export function useGraylogEventDefinitions() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['explorer', tenantId, 'graylog', 'event-definitions'],
    queryFn: () => explorerService.getGraylogEventDefinitions(),
  })
}

// ── Grafana ──────────────────────────────────────────────────────────

export function useGrafanaDashboards(params?: GrafanaDashboardSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['explorer', tenantId, 'grafana', 'dashboards', params],
    queryFn: () => explorerService.getGrafanaDashboards(params),
    placeholderData: keepPreviousData,
  })
}

export function useSyncGrafana() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => explorerService.syncGrafana(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['explorer', tenantId, 'grafana'] })
      queryClient.invalidateQueries({ queryKey: ['explorer', tenantId, 'overview'] })
    },
  })
}

// ── InfluxDB ─────────────────────────────────────────────────────────

export function useInfluxDBQuery(params: InfluxDBQueryParams, enabled = true) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['explorer', tenantId, 'influxdb', 'query', params],
    queryFn: () => explorerService.queryInfluxDB(params),
    enabled,
  })
}

export function useInfluxDBBuckets() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['explorer', tenantId, 'influxdb', 'buckets'],
    queryFn: () => explorerService.getInfluxDBBuckets(),
  })
}

// ── MISP ─────────────────────────────────────────────────────────────

export function useMispExplorerEvents(params?: MispExplorerSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['explorer', tenantId, 'misp', 'events', params],
    queryFn: () => explorerService.searchMispEvents(params),
    placeholderData: keepPreviousData,
  })
}

export function useMispEventDetail(eventId: string, enabled = true) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['explorer', tenantId, 'misp', 'events', eventId],
    queryFn: () => explorerService.getMispEventDetail(eventId),
    enabled: enabled && eventId.length > 0,
  })
}

// ── Logstash ────────────────────────────────────────────────────────

export function useLogstashLogs(params?: LogstashLogSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['explorer', tenantId, 'logstash', 'logs', params],
    queryFn: () => explorerService.getLogstashLogs(params),
    placeholderData: keepPreviousData,
  })
}

export function useSyncLogstash() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => explorerService.syncLogstash(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['explorer', tenantId, 'logstash'] })
      queryClient.invalidateQueries({ queryKey: ['explorer', tenantId, 'overview'] })
    },
  })
}

// ── Velociraptor ─────────────────────────────────────────────────────

export function useVelociraptorEndpoints(params?: VelociraptorEndpointSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['explorer', tenantId, 'velociraptor', 'endpoints', params],
    queryFn: () => explorerService.getVelociraptorEndpoints(params),
    placeholderData: keepPreviousData,
  })
}

export function useVelociraptorHunts(params?: VelociraptorHuntSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['explorer', tenantId, 'velociraptor', 'hunts', params],
    queryFn: () => explorerService.getVelociraptorHunts(params),
    placeholderData: keepPreviousData,
  })
}

export function useRunVelociraptorVQL() {
  return useMutation({
    mutationFn: (vql: string) => explorerService.runVelociraptorVQL(vql),
  })
}

export function useSyncVelociraptor() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => explorerService.syncVelociraptor(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['explorer', tenantId, 'velociraptor'] })
      queryClient.invalidateQueries({ queryKey: ['explorer', tenantId, 'overview'] })
    },
  })
}

// ── Shuffle ──────────────────────────────────────────────────────────

export function useShuffleWorkflows(params?: ShuffleWorkflowSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['explorer', tenantId, 'shuffle', 'workflows', params],
    queryFn: () => explorerService.getShuffleWorkflows(params),
    placeholderData: keepPreviousData,
  })
}

export function useSyncShuffle() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => explorerService.syncShuffle(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['explorer', tenantId, 'shuffle'] })
      queryClient.invalidateQueries({ queryKey: ['explorer', tenantId, 'overview'] })
    },
  })
}

// ── Sync Jobs ────────────────────────────────────────────────────────

export function useSyncJobs(params?: SyncJobSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['explorer', tenantId, 'sync-jobs', params],
    queryFn: () => explorerService.getSyncJobs(params),
    placeholderData: keepPreviousData,
  })
}

export function useTriggerSync() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: TriggerSyncInput) => explorerService.triggerSync(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['explorer', tenantId, 'sync-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['explorer', tenantId, 'overview'] })
    },
  })
}
