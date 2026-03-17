'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { UserRole } from '@/enums'
import { useTenants } from '@/hooks'
import { authService } from '@/services/auth.service'
import { useAuthStore, useTenantStore } from '@/stores'

export function useTenantSwitcher() {
  const t = useTranslations('layout')
  const queryClient = useQueryClient()
  const { currentTenantId, tenants, userTenants, setCurrentTenant, setTenants } = useTenantStore()
  const user = useAuthStore(s => s.user)
  const setPermissions = useAuthStore(s => s.setPermissions)

  const isGlobalAdmin = user?.role === UserRole.GLOBAL_ADMIN

  // GLOBAL_ADMIN: fetch all tenants from admin API
  const { data: tenantsData } = useTenants(undefined, isGlobalAdmin)

  useEffect(() => {
    if (tenantsData?.data && tenantsData.data.length > 0) {
      setTenants(tenantsData.data)
    }
  }, [tenantsData?.data, setTenants])

  function handleTenantChange(value: string) {
    const allowedList = isGlobalAdmin ? tenants : userTenants
    const isValid = allowedList.some(item => item.id === value)
    if (!isValid) return

    setCurrentTenant(value)
    void queryClient.invalidateQueries()

    // Immediately refresh permissions for the new tenant context
    authService
      .getMe()
      .then(meData => {
        setPermissions(meData.permissions ?? [])
      })
      .catch(() => {
        // Permissions refresh failed — keep existing permissions
      })
  }

  return {
    t,
    currentTenantId,
    tenants,
    userTenants,
    isGlobalAdmin,
    handleTenantChange,
  }
}
