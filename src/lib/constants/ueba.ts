import { MlModelStatus, MlModelType, UebaEntityType, UebaRiskLevel } from '@/enums'

export const UEBA_ENTITY_TYPE_LABEL_KEYS: Record<UebaEntityType, string> = {
  [UebaEntityType.USER]: 'entityUser',
  [UebaEntityType.HOST]: 'entityHost',
  [UebaEntityType.IP]: 'entityIp',
  [UebaEntityType.APPLICATION]: 'entityApplication',
}

export const UEBA_ENTITY_TYPE_CLASSES: Record<UebaEntityType, string> = {
  [UebaEntityType.USER]: 'bg-severity-info text-white',
  [UebaEntityType.HOST]: 'bg-severity-medium text-white',
  [UebaEntityType.IP]: 'bg-severity-high text-white',
  [UebaEntityType.APPLICATION]: 'bg-severity-low text-white',
}

export const UEBA_RISK_LEVEL_LABEL_KEYS: Record<UebaRiskLevel, string> = {
  [UebaRiskLevel.CRITICAL]: 'riskCritical',
  [UebaRiskLevel.HIGH]: 'riskHigh',
  [UebaRiskLevel.MEDIUM]: 'riskMedium',
  [UebaRiskLevel.LOW]: 'riskLow',
}

export const UEBA_RISK_LEVEL_CLASSES: Record<UebaRiskLevel, string> = {
  [UebaRiskLevel.CRITICAL]: 'bg-severity-critical text-white',
  [UebaRiskLevel.HIGH]: 'bg-severity-high text-white',
  [UebaRiskLevel.MEDIUM]: 'bg-severity-medium text-white',
  [UebaRiskLevel.LOW]: 'bg-severity-low text-white',
}

export const ML_MODEL_STATUS_LABEL_KEYS: Record<MlModelStatus, string> = {
  [MlModelStatus.ACTIVE]: 'modelActive',
  [MlModelStatus.TRAINING]: 'modelTraining',
  [MlModelStatus.INACTIVE]: 'modelInactive',
  [MlModelStatus.ERROR]: 'modelError',
}

export const ML_MODEL_STATUS_CLASSES: Record<MlModelStatus, string> = {
  [MlModelStatus.ACTIVE]: 'bg-status-success text-white',
  [MlModelStatus.TRAINING]: 'bg-status-warning text-white',
  [MlModelStatus.INACTIVE]: 'bg-muted text-muted-foreground',
  [MlModelStatus.ERROR]: 'bg-status-error text-white',
}

export const ML_MODEL_TYPE_LABEL_KEYS: Record<MlModelType, string> = {
  [MlModelType.ANOMALY_DETECTION]: 'typeAnomalyDetection',
  [MlModelType.CLASSIFICATION]: 'typeClassification',
  [MlModelType.CLUSTERING]: 'typeClustering',
  [MlModelType.REGRESSION]: 'typeRegression',
}

export const ML_MODEL_TYPE_CLASSES: Record<MlModelType, string> = {
  [MlModelType.ANOMALY_DETECTION]: 'bg-severity-high text-white',
  [MlModelType.CLASSIFICATION]: 'bg-severity-info text-white',
  [MlModelType.CLUSTERING]: 'bg-severity-medium text-white',
  [MlModelType.REGRESSION]: 'bg-severity-low text-white',
}
