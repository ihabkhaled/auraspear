'use client'

import { useTranslations } from 'next-intl'

export function useKQLSearchBar() {
  const t = useTranslations('alerts')

  return { t }
}
