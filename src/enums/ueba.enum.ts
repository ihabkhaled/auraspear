export enum UebaEntityType {
  USER = 'user',
  HOST = 'host',
  IP = 'ip',
  APPLICATION = 'application',
}

export enum UebaRiskLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum MlModelStatus {
  ACTIVE = 'active',
  TRAINING = 'training',
  INACTIVE = 'inactive',
  ERROR = 'error',
}

export enum MlModelType {
  ANOMALY_DETECTION = 'anomaly_detection',
  CLASSIFICATION = 'classification',
  CLUSTERING = 'clustering',
  REGRESSION = 'regression',
}

export enum UebaTab {
  ENTITIES = 'entities',
  ANOMALIES = 'anomalies',
  MODELS = 'models',
}
