import { useTranslations } from 'next-intl'

export function useMISPEventFeed() {
  const t = useTranslations('intel')

  return { t }
}
