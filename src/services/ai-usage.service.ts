import api from '@/lib/api'
import { extractApiData } from '@/lib/utils'
import type {
  AiBudgetAlert,
  AiCostRate,
  AiFinopsDashboard,
  AiMonthlyUsage,
  AiUsageSummary,
} from '@/types'

export const aiUsageService = {
  getUsageSummary: (startDate?: string, endDate?: string) =>
    api
      .get('/ai-usage', { params: { startDate, endDate } })
      .then(r => extractApiData<AiUsageSummary>(r)),

  getMonthlyUsage: () => api.get('/ai-usage/monthly').then(r => extractApiData<AiMonthlyUsage>(r)),

  getFinopsDashboard: () =>
    api.get('/ai-usage/finops').then(r => extractApiData<AiFinopsDashboard>(r)),

  listCostRates: () => api.get('/ai-usage/cost-rates').then(r => extractApiData<AiCostRate[]>(r)),

  upsertCostRate: (data: {
    provider: string
    model: string
    inputCostPer1k: number
    outputCostPer1k: number
  }) => api.put('/ai-usage/cost-rates', data).then(r => extractApiData<AiCostRate>(r)),

  deleteCostRate: (id: string) =>
    api.delete(`/ai-usage/cost-rates/${id}`).then(r => extractApiData<unknown>(r)),

  listBudgetAlerts: () =>
    api.get('/ai-usage/budget-alerts').then(r => extractApiData<AiBudgetAlert[]>(r)),

  upsertBudgetAlert: (data: {
    scope: string
    scopeKey?: string
    monthlyBudget: number
    alertThresholds: string
  }) => api.put('/ai-usage/budget-alerts', data).then(r => extractApiData<AiBudgetAlert>(r)),

  updateBudgetAlert: (
    id: string,
    data: {
      scope?: string
      scopeKey?: string | null
      monthlyBudget?: number
      alertThresholds?: string
    }
  ) => api.patch(`/ai-usage/budget-alerts/${id}`, data).then(r => extractApiData<AiBudgetAlert>(r)),

  deleteBudgetAlert: (id: string) =>
    api.delete(`/ai-usage/budget-alerts/${id}`).then(r => extractApiData<unknown>(r)),

  toggleBudgetAlert: (id: string, enabled: boolean) =>
    api
      .post(`/ai-usage/budget-alerts/${id}/toggle`, { enabled })
      .then(r => extractApiData<unknown>(r)),
}
