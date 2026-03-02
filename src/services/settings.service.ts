import api from '@/lib/api'
import type { PreferencesResponse } from '@/types/profile.types'

export const settingsService = {
  getPreferences: () => api.get<PreferencesResponse>('/users/preferences').then(r => r.data.data),

  updatePreferences: (data: Record<string, unknown>) =>
    api.patch<PreferencesResponse>('/users/preferences', data).then(r => r.data.data),
}
