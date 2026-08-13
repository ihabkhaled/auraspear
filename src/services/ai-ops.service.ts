import api from '@/lib/api'
import { extractApiData } from '@/lib/utils'
import type { AiOpsWorkspace } from '@/types'

export const aiOpsService = {
  getWorkspace: () => api.get('/ai-ops/workspace').then(r => extractApiData<AiOpsWorkspace>(r)),
}
