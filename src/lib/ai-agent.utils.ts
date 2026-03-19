import type { AiAgentPanelTab } from '@/enums'
import { AI_AGENT_PANEL_TABS } from '@/lib/constants/ai-agents'

export function isAiAgentPanelTab(value: string): value is AiAgentPanelTab {
  for (const tab of AI_AGENT_PANEL_TABS) {
    if (tab === value) {
      return true
    }
  }

  return false
}
