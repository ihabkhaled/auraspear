'use client'

import { useSyncExternalStore } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useUpdatePreferences } from '@/hooks/useSettings'

const noop = () => {}
const emptySubscribe = () => noop

export function ThemeSwitcher() {
  const t = useTranslations('common')
  const { resolvedTheme, setTheme } = useTheme()
  const updatePreferences = useUpdatePreferences()
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const isDark = resolvedTheme === 'dark'

  function handleToggle() {
    const next = isDark ? 'light' : 'dark'
    setTheme(next)
    updatePreferences.mutate({ theme: next })
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Moon className="text-muted-foreground h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label={isDark ? t('lightMode') : t('darkMode')}
    >
      {isDark ? (
        <Sun className="text-muted-foreground h-4 w-4" />
      ) : (
        <Moon className="text-muted-foreground h-4 w-4" />
      )}
    </Button>
  )
}
