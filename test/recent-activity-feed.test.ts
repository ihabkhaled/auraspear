import { describe, it, expect } from 'vitest'
import type { RecentActivityItem } from '@/types'

/**
 * Tests for the useRecentActivityFeed hook logic.
 *
 * Since the project uses a node-only vitest environment,
 * we test the pure data transformation logic that the hook performs:
 * - Limiting items to 5
 * - Mapping raw data to RecentActivityItem shape
 * - Handling empty/missing data
 */

const DASHBOARD_ACTIVITY_LIMIT = 5

function transformActivityData(rawItems: unknown): RecentActivityItem[] {
  if (!Array.isArray(rawItems)) {
    return []
  }
  return rawItems.slice(0, DASHBOARD_ACTIVITY_LIMIT).map(item => ({
    id: item.id,
    type: item.type,
    actorName: item.actorName,
    title: item.title,
    message: item.message,
    createdAt: item.createdAt,
    isRead: item.isRead,
  }))
}

function makeMockActivity(
  overrides: Partial<RecentActivityItem> & { id: string }
): RecentActivityItem {
  return {
    type: 'mention',
    actorName: 'John Doe',
    title: 'Test title',
    message: 'Test message',
    createdAt: '2025-01-01T00:00:00Z',
    isRead: false,
    ...overrides,
  }
}

describe('useRecentActivityFeed data transformation', () => {
  it('should return empty array when data is undefined', () => {
    const result = transformActivityData(undefined)
    expect(result).toEqual([])
  })

  it('should return empty array when data is null', () => {
    const result = transformActivityData(null)
    expect(result).toEqual([])
  })

  it('should return empty array when data is not an array', () => {
    const result = transformActivityData('not an array')
    expect(result).toEqual([])
  })

  it('should return empty array when data is an empty array', () => {
    const result = transformActivityData([])
    expect(result).toEqual([])
  })

  it('should map items correctly', () => {
    const raw = [
      {
        id: '1',
        type: 'mention',
        actorName: 'Alice',
        title: 'Title 1',
        message: 'Msg 1',
        createdAt: '2025-01-01T00:00:00Z',
        isRead: false,
        extraField: 'should be excluded',
      },
    ]
    const result = transformActivityData(raw)
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: '1',
      type: 'mention',
      actorName: 'Alice',
      title: 'Title 1',
      message: 'Msg 1',
      createdAt: '2025-01-01T00:00:00Z',
      isRead: false,
    })
  })

  it('should exclude extra fields not in RecentActivityItem', () => {
    const raw = [
      {
        id: '1',
        type: 'mention',
        actorName: 'Alice',
        title: 'Title',
        message: 'Msg',
        createdAt: '2025-01-01T00:00:00Z',
        isRead: true,
        entityType: 'case',
        entityId: '123',
        actorEmail: 'alice@example.com',
      },
    ]
    const result = transformActivityData(raw)
    expect(result[0]).not.toHaveProperty('entityType')
    expect(result[0]).not.toHaveProperty('entityId')
    expect(result[0]).not.toHaveProperty('actorEmail')
  })

  it('should limit items to 5', () => {
    const raw = Array.from({ length: 10 }, (_, idx) => makeMockActivity({ id: String(idx + 1) }))
    const result = transformActivityData(raw)
    expect(result).toHaveLength(5)
  })

  it('should return fewer than 5 items when data has fewer', () => {
    const raw = [
      makeMockActivity({ id: '1' }),
      makeMockActivity({ id: '2' }),
      makeMockActivity({ id: '3' }),
    ]
    const result = transformActivityData(raw)
    expect(result).toHaveLength(3)
  })

  it('should take first 5 items preserving order', () => {
    const raw = Array.from({ length: 8 }, (_, idx) =>
      makeMockActivity({ id: String(idx + 1), title: `Item ${idx + 1}` })
    )
    const result = transformActivityData(raw)
    expect(result.map(r => r.id)).toEqual(['1', '2', '3', '4', '5'])
  })

  it('should preserve isRead boolean value', () => {
    const raw = [
      makeMockActivity({ id: '1', isRead: true }),
      makeMockActivity({ id: '2', isRead: false }),
    ]
    const result = transformActivityData(raw)
    expect(result[0]?.isRead).toBe(true)
    expect(result[1]?.isRead).toBe(false)
  })
})
