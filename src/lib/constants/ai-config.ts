import { AiAgentId, AiOutputFormat, AiTriggerMode } from '@/enums'

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
