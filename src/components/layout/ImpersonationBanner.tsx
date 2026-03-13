'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { EyeOff, LogOut } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { Button } from '@/components/ui/button'
import { type UserRole } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { authService } from '@/services/auth.service'
import { useAuthStore, useTenantStore } from '@/stores'

export function ImpersonationBanner() {
  const t = useTranslations('impersonation')
  const tErrors = useTranslations()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { impersonator, user, setTokens, setUser, endImpersonation } = useAuthStore()
  const { setCurrentTenant } = useTenantStore()
  const [ending, setEnding] = useState(false)

  const handleEndImpersonation = useCallback(async () => {
    setEnding(true)
    try {
      const { data } = await authService.endImpersonation()

      // Restore admin session
      setTokens(data.accessToken, data.refreshToken)
      setUser({
        sub: data.user.sub,
        email: data.user.email,
        tenantId: data.user.tenantId,
        tenantSlug: data.user.tenantSlug,
        role: data.user.role as UserRole,
      })
      endImpersonation()
      setCurrentTenant(data.user.tenantId)

      // Clear stale query cache
      queryClient.clear()

      Toast.success(t('ended'))
      router.push('/admin/tenant')
    } catch (error) {
      Toast.error(tErrors(getErrorKey(error)))
    } finally {
      setEnding(false)
    }
  }, [setTokens, setUser, endImpersonation, setCurrentTenant, queryClient, router, t, tErrors])

  if (!impersonator) {
    return null
  }

  return (
    <div className="bg-status-warning border-status-warning flex items-center justify-between gap-3 border-b px-3 py-1.5 md:px-4">
      <div className="flex items-center gap-2">
        <EyeOff className="text-status-warning h-4 w-4 shrink-0" />
        <p className="text-status-warning text-xs font-medium">
          {t('banner', { admin: impersonator.email, user: user?.email ?? '' })}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="h-7 gap-1.5 text-xs"
        onClick={handleEndImpersonation}
        disabled={ending}
      >
        <LogOut className="h-3 w-3" />
        {t('endSession')}
      </Button>
    </div>
  )
}
