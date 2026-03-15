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
import { reportService } from '@/services/report.service'

const mockGet = api.get as Mock
const mockPost = api.post as Mock
const mockPatch = api.patch as Mock
const mockDelete = api.delete as Mock

describe('reportService', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  // ─── Reports ────────────────────────────────────────────────────

  describe('getReports', () => {
    it('should call GET /reports without params', async () => {
      const reports = [{ id: 'rpt-1', title: 'Monthly Security Report' }]
      mockGet.mockResolvedValue({ data: { data: reports } })

      const result = await reportService.getReports()

      expect(mockGet).toHaveBeenCalledWith('/reports', { params: undefined })
      expect(result).toEqual({ data: reports })
    })

    it('should call GET /reports with search params', async () => {
      const reports = [{ id: 'rpt-2', title: 'Incident Summary' }]
      mockGet.mockResolvedValue({ data: { data: reports } })

      const params = { search: 'incident', page: 1 }
      const result = await reportService.getReports(params)

      expect(mockGet).toHaveBeenCalledWith('/reports', { params })
      expect(result).toEqual({ data: reports })
    })

    it('should propagate API errors', async () => {
      mockGet.mockRejectedValue(new Error('Network error'))

      await expect(reportService.getReports()).rejects.toThrow('Network error')
    })
  })

  describe('getReportById', () => {
    it('should call GET /reports/:id', async () => {
      const report = { id: 'rpt-1', title: 'Monthly Security Report' }
      mockGet.mockResolvedValue({ data: { data: report } })

      const result = await reportService.getReportById('rpt-1')

      expect(mockGet).toHaveBeenCalledWith('/reports/rpt-1')
      expect(result).toEqual({ data: report })
    })

    it('should propagate API errors', async () => {
      mockGet.mockRejectedValue(new Error('Not found'))

      await expect(reportService.getReportById('rpt-999')).rejects.toThrow('Not found')
    })
  })

  describe('createReport', () => {
    it('should call POST /reports', async () => {
      const report = { id: 'rpt-3', title: 'New Report' }
      mockPost.mockResolvedValue({ data: { data: report } })

      const input = { title: 'New Report', type: 'executive' }
      const result = await reportService.createReport(input)

      expect(mockPost).toHaveBeenCalledWith('/reports', input)
      expect(result).toEqual({ data: report })
    })

    it('should propagate API errors', async () => {
      mockPost.mockRejectedValue(new Error('Validation failed'))

      await expect(reportService.createReport({ title: '' })).rejects.toThrow('Validation failed')
    })
  })

  describe('updateReport', () => {
    it('should call PATCH /reports/:id', async () => {
      const report = { id: 'rpt-1', title: 'Updated Report' }
      mockPatch.mockResolvedValue({ data: { data: report } })

      const input = { title: 'Updated Report' }
      const result = await reportService.updateReport('rpt-1', input)

      expect(mockPatch).toHaveBeenCalledWith('/reports/rpt-1', input)
      expect(result).toEqual({ data: report })
    })

    it('should propagate API errors', async () => {
      mockPatch.mockRejectedValue(new Error('Forbidden'))

      await expect(reportService.updateReport('rpt-1', { title: 'x' })).rejects.toThrow('Forbidden')
    })
  })

  describe('deleteReport', () => {
    it('should call DELETE /reports/:id', async () => {
      mockDelete.mockResolvedValue({ data: { deleted: true } })

      const result = await reportService.deleteReport('rpt-1')

      expect(mockDelete).toHaveBeenCalledWith('/reports/rpt-1')
      expect(result).toEqual({ deleted: true })
    })

    it('should propagate API errors', async () => {
      mockDelete.mockRejectedValue(new Error('Not found'))

      await expect(reportService.deleteReport('rpt-999')).rejects.toThrow('Not found')
    })
  })

  // ─── Stats ──────────────────────────────────────────────────────

  describe('getStats', () => {
    it('should call GET /reports/stats', async () => {
      const stats = { totalReports: 25, generatedThisMonth: 8 }
      mockGet.mockResolvedValue({ data: { data: stats } })

      const result = await reportService.getStats()

      expect(mockGet).toHaveBeenCalledWith('/reports/stats')
      expect(result).toEqual({ data: stats })
    })

    it('should propagate API errors', async () => {
      mockGet.mockRejectedValue(new Error('Server error'))

      await expect(reportService.getStats()).rejects.toThrow('Server error')
    })
  })
})
