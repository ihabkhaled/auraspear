'use client'

import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { applyPermissionSnapshot, invalidatePermissionSensitiveQueries } from '@/lib/auth-session'
import { authService } from '@/services/auth.service'
import { useAuthStore, useTenantStore } from '@/stores'

const PERMISSION_SYNC_INTERVAL = 60_000 // 60 seconds

/**
 * Periodically fetches /auth/me and syncs permissions + user info
 * into the auth store. This ensures permission changes made by an admin
 * take effect within ~60 seconds without requiring logout/re-login.
 *
 * Includes tenantId in the query key so switching tenants triggers
 * an immediate refetch of permissions for the new tenant context.
 */
export function usePermissionSync() {
  const queryClient = useQueryClient()
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const tenantId = useTenantStore(s => s.currentTenantId)

  const { data } = useQuery({
    queryKey: ['auth', 'me', tenantId],
    queryFn: () => authService.getMe(),
    enabled: isAuthenticated,
    refetchInterval: PERMISSION_SYNC_INTERVAL,
    refetchIntervalInBackground: false,
    staleTime: PERMISSION_SYNC_INTERVAL,
  })

  useEffect(() => {
    if (!data) return

    const changed = applyPermissionSnapshot(data)
    if (changed && tenantId.length > 0) {
      void invalidatePermissionSensitiveQueries(queryClient, tenantId)
    }
  }, [data, queryClient, tenantId])
}
