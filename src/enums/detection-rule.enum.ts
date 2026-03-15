export enum DetectionRuleType {
  SIGMA = 'sigma',
  YARA = 'yara',
  CUSTOM = 'custom',
  CORRELATION = 'correlation',
  THRESHOLD = 'threshold',
}

export enum DetectionRuleSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info',
}

export enum DetectionRuleStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  TESTING = 'testing',
  DEPRECATED = 'deprecated',
}
