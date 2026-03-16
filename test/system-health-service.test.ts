import { describe, it, expect, vi, afterEach, type Mock } from 'vitest'
vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))
import api from '@/lib/api'
import { systemHealthService } from '@/services/system-health.service'

const mockGet = api.get as Mock
const mockPost = api.post as Mock
const mockPatch = api.patch as Mock
const mockDelete = api.delete as Mock

describe('systemHealthService', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  // ─── Health Checks ──────────────────────────────────────────────

  describe('listHealthChecks', () => {
    it('should call GET /system-health/checks without params', async () => {
      const checks = [{ id: 'hc-1', service: 'database', status: 'healthy' }]
      mockGet.mockResolvedValue({ data: { data: checks } })

      const result = await systemHealthService.listHealthChecks()

      expect(mockGet).toHaveBeenCalledWith('/system-health/checks', { params: undefined })
      expect(result).toEqual({ data: checks })
    })

    it('should call GET /system-health/checks with search params', async () => {
      const checks = [{ id: 'hc-2', service: 'redis', status: 'degraded' }]
      mockGet.mockResolvedValue({ data: { data: checks } })

      const params = { status: 'degraded', page: 1 }
      const result = await systemHealthService.listHealthChecks(params)

      expect(mockGet).toHaveBeenCalledWith('/system-health/checks', { params })
      expect(result).toEqual({ data: checks })
    })

    it('should propagate API errors', async () => {
      mockGet.mockRejectedValue(new Error('Network error'))

      await expect(systemHealthService.listHealthChecks()).rejects.toThrow('Network error')
    })
  })

  describe('getLatestChecks', () => {
    it('should call GET /system-health/checks/latest', async () => {
      const checks = [{ id: 'hc-1', service: 'database', status: 'healthy' }]
      mockGet.mockResolvedValue({ data: { data: checks } })

      const result = await systemHealthService.getLatestChecks()

      expect(mockGet).toHaveBeenCalledWith('/system-health/checks/latest')
      expect(result).toEqual({ data: checks })
    })

    it('should propagate API errors', async () => {
      mockGet.mockRejectedValue(new Error('Server error'))

      await expect(systemHealthService.getLatestChecks()).rejects.toThrow('Server error')
    })
  })

  describe('createHealthCheck', () => {
    it('should call POST /system-health/checks', async () => {
      const check = { id: 'hc-3', service: 'elasticsearch', status: 'healthy' }
      mockPost.mockResolvedValue({ data: { data: check } })

      const input = { service: 'elasticsearch', endpoint: 'http://localhost:9200' }
      const result = await systemHealthService.createHealthCheck(input)

      expect(mockPost).toHaveBeenCalledWith('/system-health/checks', input)
      expect(result).toEqual({ data: check })
    })

    it('should propagate API errors', async () => {
      mockPost.mockRejectedValue(new Error('Validation failed'))

      await expect(systemHealthService.createHealthCheck({ service: '' })).rejects.toThrow(
        'Validation failed'
      )
    })
  })

  describe('updateHealthCheck', () => {
    it('should call PATCH /system-health/checks/:id', async () => {
      const check = { id: 'hc-1', service: 'database', status: 'degraded' }
      mockPatch.mockResolvedValue({ data: { data: check } })

      const input = { status: 'degraded' }
      const result = await systemHealthService.updateHealthCheck('hc-1', input)

      expect(mockPatch).toHaveBeenCalledWith('/system-health/checks/hc-1', input)
      expect(result).toEqual({ data: check })
    })

    it('should propagate API errors', async () => {
      mockPatch.mockRejectedValue(new Error('Forbidden'))

      await expect(systemHealthService.updateHealthCheck('hc-1', { status: 'x' })).rejects.toThrow(
        'Forbidden'
      )
    })
  })

  describe('deleteHealthCheck', () => {
    it('should call DELETE /system-health/checks/:id', async () => {
      mockDelete.mockResolvedValue({ data: { deleted: true } })

      const result = await systemHealthService.deleteHealthCheck('hc-1')

      expect(mockDelete).toHaveBeenCalledWith('/system-health/checks/hc-1')
      expect(result).toEqual({ deleted: true })
    })

    it('should propagate API errors', async () => {
      mockDelete.mockRejectedValue(new Error('Not found'))

      await expect(systemHealthService.deleteHealthCheck('hc-999')).rejects.toThrow('Not found')
    })
  })

  // ─── Metrics ────────────────────────────────────────────────────

  describe('listMetrics', () => {
    it('should call GET /system-health/metrics without params', async () => {
      const metrics = [{ id: 'met-1', name: 'cpu_usage', value: 45.2 }]
      mockGet.mockResolvedValue({ data: { data: metrics } })

      const result = await systemHealthService.listMetrics()

      expect(mockGet).toHaveBeenCalledWith('/system-health/metrics', { params: undefined })
      expect(result).toEqual({ data: metrics })
    })

    it('should call GET /system-health/metrics with search params', async () => {
      const metrics = [{ id: 'met-2', name: 'memory_usage', value: 72.5 }]
      mockGet.mockResolvedValue({ data: { data: metrics } })

      const params = { name: 'memory', page: 1 }
      const result = await systemHealthService.listMetrics(params)

      expect(mockGet).toHaveBeenCalledWith('/system-health/metrics', { params })
      expect(result).toEqual({ data: metrics })
    })

    it('should propagate API errors', async () => {
      mockGet.mockRejectedValue(new Error('Network error'))

      await expect(systemHealthService.listMetrics()).rejects.toThrow('Network error')
    })
  })

  // ─── Stats ──────────────────────────────────────────────────────

  describe('getStats', () => {
    it('should call GET /system-health/stats', async () => {
      const stats = { healthyServices: 8, degradedServices: 1, downServices: 0 }
      mockGet.mockResolvedValue({ data: { data: stats } })

      const result = await systemHealthService.getStats()

      expect(mockGet).toHaveBeenCalledWith('/system-health/stats')
      expect(result).toEqual({ data: stats })
    })

    it('should propagate API errors', async () => {
      mockGet.mockRejectedValue(new Error('Server error'))

      await expect(systemHealthService.getStats()).rejects.toThrow('Server error')
    })
  })
})
