import api from '@/lib/api'
import type { AiMonthlyUsage, AiUsageSummary } from '@/types'

export const aiUsageService = {
  getUsageSummary: (startDate?: string, endDate?: string) =>
    api
      .get<AiUsageSummary>('/ai-usage', {
        params: { startDate, endDate },
      })
      .then(r => r.data),

  getMonthlyUsage: () => api.get<AiMonthlyUsage>('/ai-usage/monthly').then(r => r.data),
}
