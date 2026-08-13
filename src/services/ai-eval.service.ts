import api from '@/lib/api'
import { extractApiData } from '@/lib/utils'
import type { AiEvalRun, AiEvalStats, AiEvalSuite } from '@/types'

export const aiEvalService = {
  listSuites: () => api.get('/ai-eval/suites').then(r => extractApiData<AiEvalSuite[]>(r)),

  createSuite: (data: { name: string; description?: string; datasetJson: unknown }) =>
    api.post('/ai-eval/suites', data).then(r => extractApiData<AiEvalSuite>(r)),

  deleteSuite: (id: string) =>
    api.delete(`/ai-eval/suites/${id}`).then(r => extractApiData<{ success: boolean }>(r)),

  listRuns: (suiteId?: string) =>
    api
      .get('/ai-eval/runs', { params: suiteId ? { suiteId } : {} })
      .then(r => extractApiData<AiEvalRun[]>(r)),

  getRunDetail: (id: string) =>
    api.get(`/ai-eval/runs/${id}`).then(r => extractApiData<AiEvalRun>(r)),

  startRun: (data: { suiteId: string; provider: string; model: string }) =>
    api.post('/ai-eval/runs', data).then(r => extractApiData<AiEvalRun>(r)),

  getStats: () => api.get('/ai-eval/stats').then(r => extractApiData<AiEvalStats>(r)),
}
