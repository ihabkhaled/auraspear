import { AiAgentStatus, AiAgentTier } from '@/enums'

export const AI_AGENT_STATUS_LABEL_KEYS: Record<AiAgentStatus, string> = {
  [AiAgentStatus.ONLINE]: 'statusOnline',
  [AiAgentStatus.OFFLINE]: 'statusOffline',
  [AiAgentStatus.ERROR]: 'statusError',
  [AiAgentStatus.IDLE]: 'statusIdle',
}

export const AI_AGENT_STATUS_CLASSES: Record<AiAgentStatus, string> = {
  [AiAgentStatus.ONLINE]: 'bg-status-success text-white',
  [AiAgentStatus.OFFLINE]: 'bg-muted text-muted-foreground',
  [AiAgentStatus.ERROR]: 'bg-status-error text-white',
  [AiAgentStatus.IDLE]: 'bg-status-warning text-white',
}

export const AI_AGENT_STATUS_DOT_CLASSES: Record<AiAgentStatus, string> = {
  [AiAgentStatus.ONLINE]: 'bg-status-success',
  [AiAgentStatus.OFFLINE]: 'bg-muted-foreground',
  [AiAgentStatus.ERROR]: 'bg-status-error',
  [AiAgentStatus.IDLE]: 'bg-status-warning',
}

export const AI_AGENT_TIER_LABEL_KEYS: Record<AiAgentTier, string> = {
  [AiAgentTier.TIER_1]: 'tierOne',
  [AiAgentTier.TIER_2]: 'tierTwo',
  [AiAgentTier.TIER_3]: 'tierThree',
}

export const AI_AGENT_TIER_CLASSES: Record<AiAgentTier, string> = {
  [AiAgentTier.TIER_1]: 'bg-severity-info text-white',
  [AiAgentTier.TIER_2]: 'bg-severity-medium text-white',
  [AiAgentTier.TIER_3]: 'bg-severity-critical text-white',
}
