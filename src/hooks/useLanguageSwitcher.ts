import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useUpdatePreferences } from '@/hooks/useSettings'
import { getCookie } from '@/lib/cookies'

export function useLanguageSwitcher() {
  const t = useTranslations('language')
  const router = useRouter()
  const updatePreferences = useUpdatePreferences()
  const current = getCookie('locale') || 'en'

  function handleChange(locale: string) {
    document.cookie = `locale=${locale};path=/;max-age=31536000;SameSite=Lax`
    updatePreferences.mutate({ language: locale })
    router.refresh()
  }

  return { t, current, handleChange }
}
