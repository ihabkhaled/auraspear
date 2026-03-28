export enum AiFindingStatus {
  PROPOSED = 'proposed',
  APPLIED = 'applied',
  DISMISSED = 'dismissed',
  FAILED = 'failed',
}

export enum AiFindingType {
  ALERT_TRIAGE = 'alert_triage',
  CASE_SUMMARY = 'case_summary',
  DETECTION_SUGGESTION = 'detection_suggestion',
  ENRICHMENT = 'enrichment',
  INVESTIGATION = 'investigation',
  RECOMMENDATION = 'recommendation',
  THREAT_HUNT = 'threat_hunt',
  VULNERABILITY_ANALYSIS = 'vulnerability_analysis',
}
