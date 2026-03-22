import { AiAgentId, AiFeatureKey, AiOutputFormat, AiTriggerMode, OsintAuthType } from '@/enums'

export const AI_AGENT_LABEL_KEYS: Record<AiAgentId, string> = {
  [AiAgentId.ORCHESTRATOR]: 'aiConfig.agentOrchestrator',
  [AiAgentId.L1_ANALYST]: 'aiConfig.agentL1Analyst',
  [AiAgentId.L2_ANALYST]: 'aiConfig.agentL2Analyst',
  [AiAgentId.THREAT_HUNTER]: 'aiConfig.agentThreatHunter',
  [AiAgentId.RULES_ANALYST]: 'aiConfig.agentRulesAnalyst',
  [AiAgentId.NORM_VERIFIER]: 'aiConfig.agentNormVerifier',
  [AiAgentId.DASHBOARD_BUILDER]: 'aiConfig.agentDashboardBuilder',
}

export const AI_AGENT_DESCRIPTION_KEYS: Record<AiAgentId, string> = {
  [AiAgentId.ORCHESTRATOR]: 'aiConfig.agentOrchestratorDesc',
  [AiAgentId.L1_ANALYST]: 'aiConfig.agentL1AnalystDesc',
  [AiAgentId.L2_ANALYST]: 'aiConfig.agentL2AnalystDesc',
  [AiAgentId.THREAT_HUNTER]: 'aiConfig.agentThreatHunterDesc',
  [AiAgentId.RULES_ANALYST]: 'aiConfig.agentRulesAnalystDesc',
  [AiAgentId.NORM_VERIFIER]: 'aiConfig.agentNormVerifierDesc',
  [AiAgentId.DASHBOARD_BUILDER]: 'aiConfig.agentDashboardBuilderDesc',
}

export const AI_TRIGGER_MODE_LABEL_KEYS: Record<AiTriggerMode, string> = {
  [AiTriggerMode.MANUAL_ONLY]: 'aiConfig.triggerManual',
  [AiTriggerMode.AUTO_ON_ALERT]: 'aiConfig.triggerAutoAlert',
  [AiTriggerMode.AUTO_BY_AGENT]: 'aiConfig.triggerAutoAgent',
  [AiTriggerMode.SCHEDULED]: 'aiConfig.triggerScheduled',
}

export const AI_OUTPUT_FORMAT_LABEL_KEYS: Record<AiOutputFormat, string> = {
  [AiOutputFormat.STRUCTURED_JSON]: 'aiConfig.outputJson',
  [AiOutputFormat.MARKDOWN]: 'aiConfig.outputMarkdown',
  [AiOutputFormat.RICH_CARDS]: 'aiConfig.outputRichCards',
}

export const OSINT_AUTH_TYPE_LABELS: Record<OsintAuthType, string> = {
  [OsintAuthType.NONE]: 'None',
  [OsintAuthType.API_KEY_HEADER]: 'API Key (Header)',
  [OsintAuthType.API_KEY_QUERY]: 'API Key (Query Param)',
  [OsintAuthType.BEARER]: 'Bearer Token',
  [OsintAuthType.BASIC]: 'Basic Auth (user:pass)',
}

export const AI_FEATURE_KEY_LABEL_KEYS: Record<AiFeatureKey, string> = {
  [AiFeatureKey.ALERT_SUMMARIZE]: 'featureAlertSummarize',
  [AiFeatureKey.ALERT_EXPLAIN_SEVERITY]: 'featureAlertExplainSeverity',
  [AiFeatureKey.ALERT_FALSE_POSITIVE_SCORE]: 'featureAlertFalsePositive',
  [AiFeatureKey.ALERT_NEXT_ACTION]: 'featureAlertNextAction',
  [AiFeatureKey.CASE_SUMMARIZE]: 'featureCaseSummarize',
  [AiFeatureKey.CASE_EXECUTIVE_SUMMARY]: 'featureCaseExecutiveSummary',
  [AiFeatureKey.CASE_TIMELINE]: 'featureCaseTimeline',
  [AiFeatureKey.CASE_NEXT_TASKS]: 'featureCaseNextTasks',
  [AiFeatureKey.HUNT_HYPOTHESIS]: 'featureHuntHypothesis',
  [AiFeatureKey.HUNT_NL_TO_QUERY]: 'featureHuntNlToQuery',
  [AiFeatureKey.HUNT_RESULT_INTERPRET]: 'featureHuntResultInterpret',
  [AiFeatureKey.INTEL_IOC_ENRICH]: 'featureIntelIocEnrich',
  [AiFeatureKey.INTEL_ADVISORY_DRAFT]: 'featureIntelAdvisoryDraft',
  [AiFeatureKey.DETECTION_RULE_DRAFT]: 'featureDetectionRuleDraft',
  [AiFeatureKey.DETECTION_TUNING]: 'featureDetectionTuning',
  [AiFeatureKey.REPORT_DAILY_SUMMARY]: 'featureReportDailySummary',
  [AiFeatureKey.REPORT_EXECUTIVE]: 'featureReportExecutive',
  [AiFeatureKey.DASHBOARD_ANOMALY]: 'featureDashboardAnomaly',
  [AiFeatureKey.SOAR_PLAYBOOK_DRAFT]: 'featureSoarPlaybookDraft',
  [AiFeatureKey.AGENT_TASK]: 'featureAgentTask',
  [AiFeatureKey.KNOWLEDGE_SEARCH]: 'featureKnowledgeSearch',
  [AiFeatureKey.KNOWLEDGE_GENERATE_RUNBOOK]: 'featureKnowledgeGenerateRunbook',
  [AiFeatureKey.KNOWLEDGE_SUMMARIZE_INCIDENT]: 'featureKnowledgeSummarizeIncident',
  [AiFeatureKey.ENTITY_RISK_EXPLAIN]: 'featureEntityRiskExplain',
  [AiFeatureKey.NORMALIZATION_VERIFY]: 'featureNormalizationVerify',
}
