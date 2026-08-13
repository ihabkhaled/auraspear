import { useUpdatePreferences } from '@/hooks'
import { getCookie, setCookie } from '@/lib/cookies'

export function useLanguageSwitcher() {
  const updatePreferences = useUpdatePreferences()
  const current = getCookie('locale') || 'en'

  function handleChange(locale: string) {
    setCookie('locale', locale)
    updatePreferences.mutate(
      { language: locale },
      {
        onSettled: () => window.location.reload(),
      }
    )
  }

  return { current, handleChange }
}
