import { HealthCheckStatus, MetricType, ServiceType } from '@/enums'

export const SERVICE_TYPE_LABEL_KEYS: Record<ServiceType, string> = {
  [ServiceType.WAZUH]: 'serviceWazuh',
  [ServiceType.GRAYLOG]: 'serviceGraylog',
  [ServiceType.VELOCIRAPTOR]: 'serviceVelociraptor',
  [ServiceType.GRAFANA]: 'serviceGrafana',
  [ServiceType.INFLUXDB]: 'serviceInfluxdb',
  [ServiceType.MISP]: 'serviceMisp',
  [ServiceType.SHUFFLE]: 'serviceShuffle',
  [ServiceType.LOGSTASH]: 'serviceLogstash',
  [ServiceType.BEDROCK]: 'serviceBedrock',
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
  [MetricType.EPS]: 'metricEps',
  [MetricType.LATENCY]: 'metricLatency',
  [MetricType.QUEUE_SIZE]: 'metricQueueSize',
}
