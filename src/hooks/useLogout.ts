import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { useAuthStore, useTenantStore } from '@/stores'

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { logout } = useAuthStore()
  const { setCurrentTenant } = useTenantStore()

  const handleLogout = useCallback(async () => {
    // Notify backend to invalidate session before clearing local state
    try {
      await authService.logout()
    } catch {
      // Proceed with local logout even if backend call fails
    }
    queryClient.clear()
    setCurrentTenant('')
    logout()
    router.push('/login')
  }, [queryClient, logout, setCurrentTenant, router])

  return handleLogout
}
