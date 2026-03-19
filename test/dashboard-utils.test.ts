import { describe, expect, it } from 'vitest'
import { formatDashboardPercentage, getDashboardCardGridClass } from '@/lib/dashboard.utils'

describe('dashboard utils', () => {
  it('formats missing percentages as N/A', () => {
    expect(formatDashboardPercentage(undefined)).toBe('N/A')
    expect(formatDashboardPercentage(null)).toBe('N/A')
    expect(formatDashboardPercentage(87)).toBe('87%')
  })

  it('returns full-row grid classes for medium and dense KPI card counts', () => {
    expect(getDashboardCardGridClass(4)).toContain('xl:grid-cols-4')
    expect(getDashboardCardGridClass(5)).toContain('xl:grid-cols-5')
    expect(getDashboardCardGridClass(8)).toContain('xl:grid-cols-8')
  })
})
