import { useTranslations } from 'next-intl'

export function useAppLogDetailDialog() {
  const t = useTranslations('admin')

  return { t }
}
