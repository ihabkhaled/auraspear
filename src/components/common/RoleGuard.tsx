'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { UserRole } from '@/enums'
import { canAccessRoute } from '@/lib/roles'
import { useAuthStore } from '@/stores'

interface RoleGuardProps {
  children: React.ReactNode
}

export function RoleGuard({ children }: RoleGuardProps) {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('errors')
  const { user } = useAuthStore()

  const userRole = user?.role as UserRole | undefined
  const allowed = userRole ? canAccessRoute(userRole, pathname) : false

  useEffect(() => {
    if (userRole && !allowed) {
      router.replace('/dashboard')
    }
  }, [userRole, allowed, router])

  if (!userRole || !allowed) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-sm">{t('accessDenied')}</p>
      </div>
    )
  }

  return children
}
