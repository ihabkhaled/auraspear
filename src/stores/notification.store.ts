import { create } from 'zustand'

interface NotificationUIState {
  panelOpen: boolean
  setPanelOpen: (open: boolean) => void
}

export const useNotificationStore = create<NotificationUIState>(set => ({
  panelOpen: false,
  setPanelOpen: (panelOpen: boolean) => set({ panelOpen }),
}))
