import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser, ImpersonationInfo } from '@/types'

interface AuthState {
  accessToken: string
  user: AuthUser | null
  isAuthenticated: boolean
  permissions: string[]

  /** Present when the current session is an impersonation session. */
  impersonator: ImpersonationInfo | null

  setTokens: (accessToken: string, refreshToken?: string) => void
  setUser: (user: AuthUser) => void
  setPermissions: (permissions: string[]) => void
  startImpersonation: (impersonator: ImpersonationInfo) => void
  endImpersonation: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      accessToken: '',
      user: null,
      isAuthenticated: false,
      permissions: [],
      impersonator: null,

      setTokens: accessToken => set({ accessToken, isAuthenticated: Boolean(accessToken) }),

      setUser: user => set({ user }),

      setPermissions: permissions => set({ permissions }),

      startImpersonation: impersonator => set({ impersonator }),

      endImpersonation: () => set({ impersonator: null }),

      logout: () =>
        set({
          accessToken: '',
          user: null,
          isAuthenticated: false,
          permissions: [],
          impersonator: null,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
