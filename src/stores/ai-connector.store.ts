import { create } from 'zustand'
import type { AiConnectorStoreState } from '@/types'

export const useAiConnectorStore = create<AiConnectorStoreState>(set => ({
  selectedConnector: 'default',
  setSelectedConnector: selectedConnector => set({ selectedConnector }),
}))
