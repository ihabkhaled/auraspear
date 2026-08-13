import api from '@/lib/api'
import { extractApiData } from '@/lib/utils'
import type { AiSimulation, AiSimulationStats } from '@/types'

export const aiSimulationService = {
  list: () => api.get('/ai-simulations').then(r => extractApiData<AiSimulation[]>(r)),

  create: (data: { name: string; description?: string; agentId: string; datasetJson: unknown }) =>
    api.post('/ai-simulations', data).then(r => extractApiData<AiSimulation>(r)),

  get: (id: string) => api.get(`/ai-simulations/${id}`).then(r => extractApiData<AiSimulation>(r)),

  delete: (id: string) =>
    api.delete(`/ai-simulations/${id}`).then(r => extractApiData<{ success: boolean }>(r)),

  getStats: () => api.get('/ai-simulations/stats').then(r => extractApiData<AiSimulationStats>(r)),
}
