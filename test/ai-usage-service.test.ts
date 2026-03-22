import { describe, it, expect, vi, afterEach, type Mock } from 'vitest'
vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
  },
}))
import api from '@/lib/api'
import { aiUsageService } from '@/services/ai-usage.service'

const mockGet = api.get as Mock

describe('aiUsageService', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  // ─── getUsageSummary ──────────────────────────────────────────

  describe('getUsageSummary', () => {
    it('should call GET /ai-usage without date params', async () => {
      const summary = { totalRequests: 500, totalTokens: 120000, costUsd: 12.5 }
      mockGet.mockResolvedValue({ data: summary })

      const result = await aiUsageService.getUsageSummary()

      expect(mockGet).toHaveBeenCalledWith('/ai-usage', {
        params: { startDate: undefined, endDate: undefined },
      })
      expect(result).toEqual(summary)
    })

    it('should call GET /ai-usage with date range', async () => {
      const summary = { totalRequests: 100, totalTokens: 25000, costUsd: 3.2 }
      mockGet.mockResolvedValue({ data: summary })

      const result = await aiUsageService.getUsageSummary('2024-01-01', '2024-01-31')

      expect(mockGet).toHaveBeenCalledWith('/ai-usage', {
        params: { startDate: '2024-01-01', endDate: '2024-01-31' },
      })
      expect(result).toEqual(summary)
    })

    it('should propagate API errors', async () => {
      mockGet.mockRejectedValue(new Error('Server error'))

      await expect(aiUsageService.getUsageSummary()).rejects.toThrow('Server error')
    })
  })

  // ─── getMonthlyUsage ──────────────────────────────────────────

  describe('getMonthlyUsage', () => {
    it('should call GET /ai-usage/monthly', async () => {
      const monthly = { months: [{ month: '2024-01', requests: 200, tokens: 50000 }] }
      mockGet.mockResolvedValue({ data: monthly })

      const result = await aiUsageService.getMonthlyUsage()

      expect(mockGet).toHaveBeenCalledWith('/ai-usage/monthly')
      expect(result).toEqual(monthly)
    })

    it('should propagate API errors', async () => {
      mockGet.mockRejectedValue(new Error('Forbidden'))

      await expect(aiUsageService.getMonthlyUsage()).rejects.toThrow('Forbidden')
    })
  })
})
