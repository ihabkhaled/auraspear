import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Tenant } from '@/types'

interface TenantState {
  currentTenantId: string
  tenants: Tenant[]
  setCurrentTenant: (id: string) => void
  setTenants: (tenants: Tenant[]) => void
}

export const useTenantStore = create<TenantState>()(
  persist(
    set => ({
      currentTenantId: '',
      tenants: [],
      setCurrentTenant: id => set({ currentTenantId: id }),
      setTenants: tenants => set({ tenants }),
    }),
    {
      name: 'tenant-storage',
    }
  )
)
