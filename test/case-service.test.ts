import { describe, it, expect, vi, afterEach, type Mock } from 'vitest'
// Mock the api module before importing the service
vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))
import api from '@/lib/api'
import { caseService } from '@/services/case.service'

const mockPost = api.post as Mock
const mockPatch = api.patch as Mock
const mockDelete = api.delete as Mock

describe('caseService', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  // ─── Tasks ──────────────────────────────────────────────────────

  describe('createTask', () => {
    it('should call POST /cases/:caseId/tasks', async () => {
      const taskData = { id: 'task-1', title: 'Investigate alert' }
      mockPost.mockResolvedValue({ data: { data: taskData } })

      const input = { title: 'Investigate alert' }
      const result = await caseService.createTask('case-1', input)

      expect(mockPost).toHaveBeenCalledWith('/cases/case-1/tasks', input)
      expect(result).toEqual(taskData)
    })

    it('should pass assignee when provided', async () => {
      const taskData = { id: 'task-2', title: 'Review logs', assignee: 'user-1' }
      mockPost.mockResolvedValue({ data: { data: taskData } })

      const input = { title: 'Review logs', assignee: 'user-1' }
      await caseService.createTask('case-2', input)

      expect(mockPost).toHaveBeenCalledWith('/cases/case-2/tasks', input)
    })

    it('should propagate API errors', async () => {
      mockPost.mockRejectedValue(new Error('Server error'))

      await expect(caseService.createTask('case-1', { title: 'Failing task' })).rejects.toThrow(
        'Server error'
      )
    })
  })

  describe('updateTask', () => {
    it('should call PATCH /cases/:caseId/tasks/:taskId', async () => {
      const taskData = { id: 'task-1', title: 'Updated title', status: 'completed' }
      mockPatch.mockResolvedValue({ data: { data: taskData } })

      const input = { title: 'Updated title', status: 'completed' }
      const result = await caseService.updateTask('case-1', 'task-1', input)

      expect(mockPatch).toHaveBeenCalledWith('/cases/case-1/tasks/task-1', input)
      expect(result).toEqual(taskData)
    })

    it('should support partial updates with only status', async () => {
      const taskData = { id: 'task-1', status: 'in_progress' }
      mockPatch.mockResolvedValue({ data: { data: taskData } })

      const input = { status: 'in_progress' }
      await caseService.updateTask('case-3', 'task-1', input)

      expect(mockPatch).toHaveBeenCalledWith('/cases/case-3/tasks/task-1', input)
    })

    it('should support setting assignee to null', async () => {
      const taskData = { id: 'task-1', assignee: null }
      mockPatch.mockResolvedValue({ data: { data: taskData } })

      const input = { assignee: null }
      await caseService.updateTask('case-1', 'task-1', input)

      expect(mockPatch).toHaveBeenCalledWith('/cases/case-1/tasks/task-1', input)
    })
  })

  describe('deleteTask', () => {
    it('should call DELETE /cases/:caseId/tasks/:taskId', async () => {
      mockDelete.mockResolvedValue({ data: { deleted: true } })

      const result = await caseService.deleteTask('case-1', 'task-1')

      expect(mockDelete).toHaveBeenCalledWith('/cases/case-1/tasks/task-1')
      expect(result).toEqual({ deleted: true })
    })

    it('should propagate API errors', async () => {
      mockDelete.mockRejectedValue(new Error('Not found'))

      await expect(caseService.deleteTask('case-1', 'nonexistent')).rejects.toThrow('Not found')
    })
  })

  // ─── Artifacts ──────────────────────────────────────────────────

  describe('createArtifact', () => {
    it('should call POST /cases/:caseId/artifacts', async () => {
      const artifactData = { id: 'art-1', type: 'ip', value: '192.168.1.1' }
      mockPost.mockResolvedValue({ data: { data: artifactData } })

      const input = { type: 'ip', value: '192.168.1.1' }
      const result = await caseService.createArtifact('case-1', input)

      expect(mockPost).toHaveBeenCalledWith('/cases/case-1/artifacts', input)
      expect(result).toEqual(artifactData)
    })

    it('should pass source when provided', async () => {
      const artifactData = { id: 'art-2', type: 'hash', value: 'abc123', source: 'MISP' }
      mockPost.mockResolvedValue({ data: { data: artifactData } })

      const input = { type: 'hash', value: 'abc123', source: 'MISP' }
      await caseService.createArtifact('case-2', input)

      expect(mockPost).toHaveBeenCalledWith('/cases/case-2/artifacts', input)
    })

    it('should propagate API errors', async () => {
      mockPost.mockRejectedValue(new Error('Validation failed'))

      await expect(caseService.createArtifact('case-1', { type: 'ip', value: '' })).rejects.toThrow(
        'Validation failed'
      )
    })
  })

  describe('deleteArtifact', () => {
    it('should call DELETE /cases/:caseId/artifacts/:artifactId', async () => {
      mockDelete.mockResolvedValue({ data: { deleted: true } })

      const result = await caseService.deleteArtifact('case-1', 'art-1')

      expect(mockDelete).toHaveBeenCalledWith('/cases/case-1/artifacts/art-1')
      expect(result).toEqual({ deleted: true })
    })

    it('should propagate API errors', async () => {
      mockDelete.mockRejectedValue(new Error('Forbidden'))

      await expect(caseService.deleteArtifact('case-1', 'art-99')).rejects.toThrow('Forbidden')
    })
  })
})
