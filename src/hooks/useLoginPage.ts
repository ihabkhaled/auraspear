import { useSyncExternalStore } from 'react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { getCookie, setCookie } from '@/lib/cookies'
import { useLoginForm } from './useLoginForm'

const noop = () => {}
const emptySubscribe = () => noop

const changeLocale = (locale: string) => {
  setCookie('locale', locale)
  window.location.reload()
}

export function useLoginPage() {
  const t = useTranslations('auth')
  const tApp = useTranslations('app')
  const tLang = useTranslations('language')
  const tCommon = useTranslations('common')
  const tMarketing = useTranslations('marketing.nav')
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
  const loginForm = useLoginForm()

  const isDark = resolvedTheme === 'dark'
  const currentLocale = getCookie('locale') || 'en'

  function handleThemeToggle() {
    setTheme(isDark ? 'light' : 'dark')
  }

  return {
    t,
    tApp,
    tLang,
    tCommon,
    tMarketing,
    mounted,
    isDark,
    currentLocale,
    handleThemeToggle,
    handleLocaleChange: changeLocale,
    ...loginForm,
  }
}
