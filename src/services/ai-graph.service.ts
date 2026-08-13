import api from '@/lib/api'
import { extractApiData } from '@/lib/utils'
import type { AgentGraphNode, ScheduleHealthSummary } from '@/types'

export const aiGraphService = {
  getGraph: () => api.get('/ai-agents/graph').then(r => extractApiData<AgentGraphNode[]>(r)),

  getScheduleHealth: () =>
    api.get('/ai-agents/schedule-health').then(r => extractApiData<ScheduleHealthSummary>(r)),
}
