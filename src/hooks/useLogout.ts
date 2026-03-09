import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores'

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { logout } = useAuthStore()

  const handleLogout = useCallback(async () => {
    // Notify backend to invalidate session before clearing local state
    try {
      await authService.logout()
    } catch {
      // Proceed with local logout even if backend call fails
    }
    queryClient.clear()
    logout()
    router.push('/login')
  }, [queryClient, logout, router])

  return handleLogout
}
