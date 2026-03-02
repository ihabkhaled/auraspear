import { create } from 'zustand'
import { TimeRange } from '@/enums'
import type { AlertSeverity } from '@/enums'

interface FilterState {
  severity: AlertSeverity[]
  timeRange: TimeRange
  agents: string[]
  kqlQuery: string
  setSeverity: (severity: AlertSeverity[]) => void
  setTimeRange: (timeRange: TimeRange) => void
  setAgents: (agents: string[]) => void
  setKqlQuery: (query: string) => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterState>(set => ({
  severity: [],
  timeRange: TimeRange.H24,
  agents: [],
  kqlQuery: '',
  setSeverity: severity => set({ severity }),
  setTimeRange: timeRange => set({ timeRange }),
  setAgents: agents => set({ agents }),
  setKqlQuery: kqlQuery => set({ kqlQuery }),
  resetFilters: () => set({ severity: [], timeRange: TimeRange.H24, agents: [], kqlQuery: '' }),
}))
