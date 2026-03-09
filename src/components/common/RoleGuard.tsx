'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { UserRole } from '@/enums'
import { canAccessRoute } from '@/lib/roles'
import { useAuthStore } from '@/stores'

interface RoleGuardProps {
  children: React.ReactNode
}

export function RoleGuard({ children }: RoleGuardProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuthStore()

  const userRole = user?.role as UserRole | undefined
  const allowed = userRole ? canAccessRoute(userRole, pathname) : false

  useEffect(() => {
    if (userRole && !allowed) {
      router.replace('/dashboard')
    }
  }, [userRole, allowed, router])

  if (!userRole || !allowed) {
    return null
  }

  return children
}
