import { useTranslations } from 'next-intl'

export function useMITRETopTechniques() {
  const t = useTranslations('dashboard')

  return { t }
}
