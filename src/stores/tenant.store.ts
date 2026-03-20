import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createPersistStorage } from '@/lib/persist-storage'
import type { Tenant, TenantMembershipInfo } from '@/types'

interface TenantState {
  currentTenantId: string
  tenants: Tenant[]
  userTenants: TenantMembershipInfo[]
  setCurrentTenant: (id: string) => void
  setTenants: (tenants: Tenant[]) => void
  setUserTenants: (tenants: TenantMembershipInfo[]) => void
}

export const useTenantStore = create<TenantState>()(
  persist(
    set => ({
      currentTenantId: '',
      tenants: [],
      userTenants: [],
      setCurrentTenant: id => set({ currentTenantId: id }),
      setTenants: tenants => set({ tenants }),
      setUserTenants: userTenants => set({ userTenants }),
    }),
    {
      name: 'tenant-storage',
      storage: createPersistStorage(),
    }
  )
)
