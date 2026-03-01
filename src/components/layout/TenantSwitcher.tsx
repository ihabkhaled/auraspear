'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserRole } from '@/enums'
import { useTenants } from '@/hooks'
import { useAuthStore, useTenantStore } from '@/stores'

export function TenantSwitcher() {
  const t = useTranslations('layout')
  const queryClient = useQueryClient()
  const { currentTenantId, tenants, setCurrentTenant, setTenants } = useTenantStore()
  const user = useAuthStore(s => s.user)

  const isGlobalAdmin = user?.role === UserRole.GLOBAL_ADMIN
  const { data: tenantsData } = useTenants(isGlobalAdmin)

  useEffect(() => {
    if (tenantsData?.data && tenantsData.data.length > 0) {
      setTenants(tenantsData.data)
    }
  }, [tenantsData?.data, setTenants])

  function handleTenantChange(value: string) {
    setCurrentTenant(value)
    void queryClient.invalidateQueries()
  }

  // Non-global-admin users only have their own tenant — no switcher needed
  if (!isGlobalAdmin || tenants.length <= 1) {
    return null
  }

  return (
    <Select value={currentTenantId} onValueChange={handleTenantChange}>
      <SelectTrigger size="sm" className="w-[160px]">
        <SelectValue placeholder={t('selectTenant')} />
      </SelectTrigger>
      <SelectContent>
        {tenants.map(tenant => (
          <SelectItem key={tenant.id} value={tenant.id}>
            {tenant.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
