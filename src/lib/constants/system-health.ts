import { HealthCheckStatus, MetricType, ServiceType } from '@/enums'

export const SERVICE_TYPE_LABEL_KEYS: Record<ServiceType, string> = {
  [ServiceType.CONNECTOR]: 'serviceConnector',
  [ServiceType.DATABASE]: 'serviceDatabase',
  [ServiceType.API]: 'serviceApi',
  [ServiceType.QUEUE]: 'serviceQueue',
  [ServiceType.STORAGE]: 'serviceStorage',
}

export const HEALTH_CHECK_STATUS_LABEL_KEYS: Record<HealthCheckStatus, string> = {
  [HealthCheckStatus.HEALTHY]: 'statusHealthy',
  [HealthCheckStatus.DEGRADED]: 'statusDegraded',
  [HealthCheckStatus.DOWN]: 'statusDown',
  [HealthCheckStatus.UNKNOWN]: 'statusUnknown',
}

export const HEALTH_CHECK_STATUS_CLASSES: Record<HealthCheckStatus, string> = {
  [HealthCheckStatus.HEALTHY]: 'bg-status-success text-white',
  [HealthCheckStatus.DEGRADED]: 'bg-status-warning text-white',
  [HealthCheckStatus.DOWN]: 'bg-status-error text-white',
  [HealthCheckStatus.UNKNOWN]: 'bg-muted text-muted-foreground',
}

export const METRIC_TYPE_LABEL_KEYS: Record<MetricType, string> = {
  [MetricType.CPU]: 'metricCpu',
  [MetricType.MEMORY]: 'metricMemory',
  [MetricType.DISK]: 'metricDisk',
  [MetricType.NETWORK]: 'metricNetwork',
  [MetricType.QUEUE_DEPTH]: 'metricQueueDepth',
  [MetricType.LATENCY]: 'metricLatency',
}
