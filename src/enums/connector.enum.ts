export enum ConnectorType {
  WAZUH = 'wazuh',
  GRAYLOG = 'graylog',
  LOGSTASH = 'logstash',
  VELOCIRAPTOR = 'velociraptor',
  GRAFANA = 'grafana',
  INFLUXDB = 'influxdb',
  MISP = 'misp',
  SHUFFLE = 'shuffle',
  BEDROCK = 'bedrock',
}

export enum ConnectorStatus {
  NOT_CONFIGURED = 'not_configured',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  TESTING = 'testing',
}

export enum ConnectorAuthType {
  API_KEY = 'apiKey',
  BASIC = 'basic',
  BEARER = 'bearer',
  IAM = 'iam',
}

export enum ConnectorCategory {
  SIEM = 'siem',
  EDR = 'edr',
  OBSERVABILITY = 'observability',
  THREAT_INTEL = 'threat_intel',
  SOAR = 'soar',
  AI = 'ai',
}
