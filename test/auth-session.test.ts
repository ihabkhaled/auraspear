import { QueryClient } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Permission, UserRole } from '@/enums'
import {
  applyPermissionSnapshot,
  hasPermissionSnapshotChanged,
  invalidatePermissionSensitiveQueries,
  refreshCurrentSessionPermissions,
} from '@/lib/auth-session'
import { authService } from '@/services/auth.service'
import { useAuthStore, useTenantStore } from '@/stores'

vi.mock('@/services/auth.service', () => ({
  authService: {
    getMe: vi.fn(),
  },
}))

describe('auth-session helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.getState().logout()
    useTenantStore.getState().setCurrentTenant('')
    useTenantStore.getState().setTenants([])
    useTenantStore.getState().setUserTenants([])
  })

  it('detects permission snapshot changes when permissions differ', () => {
    const changed = hasPermissionSnapshotChanged(
      [Permission.ALERTS_VIEW],
      [Permission.ALERTS_VIEW, Permission.CASES_VIEW],
      null,
      {
        sub: 'user-1',
        email: 'analyst@auraspear.io',
        tenantId: 'tenant-1',
        tenantSlug: 'tenant-1',
        role: UserRole.SOC_ANALYST_L1,
      }
    )

    expect(changed).toBe(true)
  })

  it('applies a permission snapshot to the auth store', () => {
    const changed = applyPermissionSnapshot({
      user: {
        sub: 'user-1',
        email: 'analyst@auraspear.io',
        tenantId: 'tenant-1',
        tenantSlug: 'tenant-1',
        role: UserRole.SOC_ANALYST_L2,
      },
      permissions: [Permission.ALERTS_VIEW, Permission.CASES_VIEW],
    })

    expect(changed).toBe(true)
    expect(useAuthStore.getState().permissions).toEqual([
      Permission.ALERTS_VIEW,
      Permission.CASES_VIEW,
    ])
    expect(useAuthStore.getState().user).toMatchObject({
      sub: 'user-1',
      role: UserRole.SOC_ANALYST_L2,
    })
  })

  it('invalidates non-auth queries after permission changes', async () => {
    const queryClient = new QueryClient()
    const authQueryFn = vi.fn().mockResolvedValue('auth-data')
    const alertsQueryFn = vi.fn().mockResolvedValue('alerts-data')

    await queryClient.fetchQuery({
      queryKey: ['auth', 'me', 'tenant-1'],
      queryFn: authQueryFn,
    })
    await queryClient.fetchQuery({
      queryKey: ['alerts', 'tenant-1'],
      queryFn: alertsQueryFn,
    })

    await invalidatePermissionSensitiveQueries(queryClient, 'tenant-1')
    await queryClient.refetchQueries({ queryKey: ['alerts', 'tenant-1'] })

    expect(authQueryFn).toHaveBeenCalledTimes(1)
    expect(alertsQueryFn).toHaveBeenCalledTimes(2)
  })

  it('refreshes the current session and invalidates active queries when the snapshot changes', async () => {
    const queryClient = new QueryClient()
    const getMeMock = vi.mocked(authService.getMe)

    useAuthStore.getState().setTokens('access-token')
    useAuthStore.getState().setUser({
      sub: 'user-1',
      email: 'analyst@auraspear.io',
      tenantId: 'tenant-1',
      tenantSlug: 'tenant-1',
      role: UserRole.SOC_ANALYST_L1,
    } as never)
    useAuthStore.getState().setPermissions([Permission.ALERTS_VIEW])
    useTenantStore.getState().setCurrentTenant('tenant-1')

    const alertsQueryFn = vi.fn().mockResolvedValue('alerts-data')
    await queryClient.fetchQuery({
      queryKey: ['alerts', 'tenant-1'],
      queryFn: alertsQueryFn,
    })

    getMeMock.mockResolvedValue({
      user: {
        sub: 'user-1',
        email: 'analyst@auraspear.io',
        tenantId: 'tenant-1',
        tenantSlug: 'tenant-1',
        role: UserRole.SOC_ANALYST_L2,
      },
      permissions: [Permission.ALERTS_VIEW, Permission.CASES_VIEW],
    })

    await refreshCurrentSessionPermissions(queryClient)
    await queryClient.refetchQueries({ queryKey: ['alerts', 'tenant-1'] })

    expect(useAuthStore.getState().permissions).toEqual([
      Permission.ALERTS_VIEW,
      Permission.CASES_VIEW,
    ])
    expect(useAuthStore.getState().user?.role).toBe(UserRole.SOC_ANALYST_L2)
    expect(alertsQueryFn).toHaveBeenCalledTimes(2)
  })
})
