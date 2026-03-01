'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toast } from '@/components/common'
import { getErrorKey } from '@/lib/api-error'
import { authService } from '@/services/auth.service'
import { useAuthStore, useTenantStore } from '@/stores'

export default function LoginPage() {
  const t = useTranslations('auth')
  const tErrors = useTranslations()
  const tApp = useTranslations('app')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setTokens, setUser } = useAuthStore()
  const { setCurrentTenant } = useTenantStore()

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    setIsLoading(true)

    authService
      .login(email, password)
      .then(data => {
        setTokens(data.accessToken, data.refreshToken)
        setUser(data.user)
        setCurrentTenant(data.user.tenantId)
        router.push('/dashboard')
      })
      .catch((error: unknown) => {
        const key = getErrorKey(error)
        Toast.error(tErrors(key))
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-xl">
            <Shield className="text-primary-foreground h-6 w-6" />
          </div>
          <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            {tApp('name')}
          </p>
          <CardTitle className="text-xl">{t('welcomeBack')}</CardTitle>
          <CardDescription>{t('signInDescription')}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@aura-finance.io"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('signingIn') : t('signInButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
