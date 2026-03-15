import { create } from 'zustand'
import type { HuntStatus } from '@/enums'
import type { HuntMessage } from '@/types'

interface HuntState {
  messages: HuntMessage[]
  huntStatus: HuntStatus | null
  huntId: string | null
  addMessage: (message: HuntMessage) => void
  setHuntStatus: (status: HuntStatus) => void
  setHuntId: (id: string) => void
  resetHuntState: () => void
  clearSession: () => void
}

export const useHuntStore = create<HuntState>(set => ({
  messages: [],
  huntStatus: null,
  huntId: null,
  addMessage: message => set(state => ({ messages: [...state.messages, message] })),
  setHuntStatus: huntStatus => set({ huntStatus }),
  setHuntId: huntId => set({ huntId }),
  resetHuntState: () => set({ huntStatus: null, huntId: null }),
  clearSession: () => set({ messages: [], huntStatus: null, huntId: null }),
}))
