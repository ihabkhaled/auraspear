import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores'

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { logout } = useAuthStore()

  const handleLogout = useCallback(() => {
    queryClient.clear()
    logout()
    router.push('/login')
  }, [queryClient, logout, router])

  return handleLogout
}
