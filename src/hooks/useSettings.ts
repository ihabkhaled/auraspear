'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsService } from '@/services/settings.service'
import { useAuthStore } from '@/stores'

const PREFERENCES_BASE_KEY = 'preferences'

export function usePreferences() {
  const { user } = useAuthStore()
  const queryKey = [PREFERENCES_BASE_KEY, user?.sub ?? ''] as const

  return useQuery({
    queryKey,
    queryFn: () => settingsService.getPreferences(),
    enabled: Boolean(user),
  })
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const queryKey = [PREFERENCES_BASE_KEY, user?.sub ?? ''] as const

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => settingsService.updatePreferences(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey })
    },
  })
}
