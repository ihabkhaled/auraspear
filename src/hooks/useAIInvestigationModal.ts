'use client'

import { useTranslations } from 'next-intl'

export function useAIInvestigationModal() {
  const t = useTranslations('alerts')

  return { t }
}
