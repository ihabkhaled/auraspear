import api from '@/lib/api'
import { extractApiData } from '@/lib/utils'
import type { SearchableModule, SemanticSearchResult } from '@/types'

export const aiSearchService = {
  search: (query: string, modules?: string[], limit?: number) =>
    api
      .get('/ai-search', {
        params: {
          query,
          ...(modules && modules.length > 0 ? { modules: modules.join(',') } : {}),
          ...(limit ? { limit: String(limit) } : {}),
        },
      })
      .then(r => extractApiData<SemanticSearchResult[]>(r)),

  getModules: () => api.get('/ai-search/modules').then(r => extractApiData<SearchableModule[]>(r)),
}
