export enum ServiceType {
  WAZUH = 'wazuh',
  GRAYLOG = 'graylog',
  VELOCIRAPTOR = 'velociraptor',
  GRAFANA = 'grafana',
  INFLUXDB = 'influxdb',
  MISP = 'misp',
  SHUFFLE = 'shuffle',
  LOGSTASH = 'logstash',
  BEDROCK = 'bedrock',
}

export enum HealthCheckStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  DOWN = 'down',
  UNKNOWN = 'unknown',
}

export enum MetricType {
  CPU = 'cpu',
  MEMORY = 'memory',
  DISK = 'disk',
  EPS = 'eps',
  LATENCY = 'latency',
  QUEUE_SIZE = 'queue_size',
}
