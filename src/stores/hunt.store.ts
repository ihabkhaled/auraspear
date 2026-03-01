import { create } from 'zustand'
import { HuntStatus } from '@/enums'
import { mockHuntSession } from '@/mocks/data/hunt.data'
import type { HuntMessage } from '@/types'

interface HuntState {
  messages: HuntMessage[]
  huntStatus: HuntStatus | null
  huntId: string | null
  addMessage: (message: HuntMessage) => void
  setHuntStatus: (status: HuntStatus) => void
  setHuntId: (id: string) => void
  clearSession: () => void
}

export const useHuntStore = create<HuntState>(set => ({
  messages: mockHuntSession.messages,
  huntStatus: HuntStatus.COMPLETED,
  huntId: mockHuntSession.id,
  addMessage: (message) => set(state => ({ messages: [...state.messages, message] })),
  setHuntStatus: (huntStatus) => set({ huntStatus }),
  setHuntId: (huntId) => set({ huntId }),
  clearSession: () => set({ messages: [], huntStatus: null, huntId: null }),
}))
