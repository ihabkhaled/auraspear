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
import { memoryService } from '@/services/memory.service'

const mockGet = api.get as Mock
const mockPost = api.post as Mock
const mockPatch = api.patch as Mock
const mockDelete = api.delete as Mock

afterEach(() => {
  vi.clearAllMocks()
})

describe('memoryService', () => {
  describe('list', () => {
    it('calls GET /user-memory with params', async () => {
      const mockResponse = { data: { data: [], total: 0 } }
      mockGet.mockResolvedValueOnce(mockResponse)

      const params = { category: 'fact', search: 'test', limit: 10, offset: 0 }
      const result = await memoryService.list(params)

      expect(mockGet).toHaveBeenCalledWith('/user-memory', { params })
      expect(result).toEqual(mockResponse.data)
    })

    it('calls GET /user-memory without params when none provided', async () => {
      const mockResponse = { data: { data: [], total: 0 } }
      mockGet.mockResolvedValueOnce(mockResponse)

      const result = await memoryService.list()

      expect(mockGet).toHaveBeenCalledWith('/user-memory', { params: undefined })
      expect(result).toEqual(mockResponse.data)
    })

    it('propagates errors from api.get', async () => {
      const error = new Error('Network error')
      mockGet.mockRejectedValueOnce(error)

      await expect(memoryService.list()).rejects.toThrow('Network error')
    })
  })

  describe('create', () => {
    it('calls POST /user-memory with data', async () => {
      const input = { content: 'Remember this', category: 'fact' }
      const mockResponse = { data: { data: { id: '1', content: 'Remember this' } } }
      mockPost.mockResolvedValueOnce(mockResponse)

      const result = await memoryService.create(input)

      expect(mockPost).toHaveBeenCalledWith('/user-memory', input)
      expect(result).toEqual(mockResponse.data)
    })

    it('propagates errors from api.post', async () => {
      const error = new Error('Validation error')
      mockPost.mockRejectedValueOnce(error)

      await expect(memoryService.create({ content: '' })).rejects.toThrow('Validation error')
    })
  })

  describe('update', () => {
    it('calls PATCH /user-memory/:id with data', async () => {
      const id = 'mem-123'
      const data = { content: 'Updated content', category: 'preference' }
      const mockResponse = { data: { data: { id, ...data } } }
      mockPatch.mockResolvedValueOnce(mockResponse)

      const result = await memoryService.update(id, data)

      expect(mockPatch).toHaveBeenCalledWith(`/user-memory/${id}`, data)
      expect(result).toEqual(mockResponse.data)
    })

    it('propagates errors from api.patch', async () => {
      const error = new Error('Not found')
      mockPatch.mockRejectedValueOnce(error)

      await expect(memoryService.update('bad-id', { content: 'x' })).rejects.toThrow('Not found')
    })
  })

  describe('delete', () => {
    it('calls DELETE /user-memory/:id', async () => {
      const id = 'mem-456'
      const mockResponse = { data: { data: undefined } }
      mockDelete.mockResolvedValueOnce(mockResponse)

      const result = await memoryService.delete(id)

      expect(mockDelete).toHaveBeenCalledWith(`/user-memory/${id}`)
      expect(result).toEqual(mockResponse.data)
    })

    it('propagates errors from api.delete', async () => {
      const error = new Error('Forbidden')
      mockDelete.mockRejectedValueOnce(error)

      await expect(memoryService.delete('bad-id')).rejects.toThrow('Forbidden')
    })
  })

  describe('deleteAll', () => {
    it('calls DELETE /user-memory', async () => {
      const mockResponse = { data: { data: { deleted: 5 } } }
      mockDelete.mockResolvedValueOnce(mockResponse)

      const result = await memoryService.deleteAll()

      expect(mockDelete).toHaveBeenCalledWith('/user-memory')
      expect(result).toEqual(mockResponse.data)
    })

    it('propagates errors from api.delete', async () => {
      const error = new Error('Server error')
      mockDelete.mockRejectedValueOnce(error)

      await expect(memoryService.deleteAll()).rejects.toThrow('Server error')
    })
  })
})
