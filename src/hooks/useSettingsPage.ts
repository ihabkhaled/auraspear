import { useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { Toast } from '@/components/common'
import { getErrorKey } from '@/lib/api-error'
import { getCookie } from '@/lib/cookies'
import { usePreferences, useUpdatePreferences } from './useSettings'

const noop = () => {}
const emptySubscribe = () => noop

export function useSettingsPage() {
  const tErrors = useTranslations()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { data: preferences } = usePreferences()
  const updatePreferences = useUpdatePreferences()

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const currentLocale = mounted ? getCookie('locale') || 'en' : 'en'
  const currentTheme = mounted ? (theme ?? 'system') : 'system'

  const emailAlerts = Boolean(preferences?.['notificationsEmail'])
  const browserNotifications = Boolean(preferences?.['notificationsInApp'])

  function handleThemeChange(value: string) {
    setTheme(value)
    updatePreferences.mutate({ theme: value })
  }

  function handleLanguageChange(locale: string) {
    document.cookie = `locale=${locale};path=/;max-age=31536000;SameSite=Lax`
    updatePreferences.mutate({ language: locale })
    router.refresh()
  }

  function handleNotificationToggle(key: string, checked: boolean, t: (key: string) => string) {
    updatePreferences.mutate(
      { [key]: checked },
      {
        onSuccess: () => {
          Toast.success(t('saved'))
        },
        onError: (error: unknown) => {
          Toast.error(tErrors(getErrorKey(error)))
        },
      }
    )
  }

  return {
    mounted,
    currentLocale,
    currentTheme,
    emailAlerts,
    browserNotifications,
    updatePreferencesPending: updatePreferences.isPending,
    handleThemeChange,
    handleLanguageChange,
    handleNotificationToggle,
  }
}
