import { useTranslations } from 'next-intl'

export function useWazuhCorrelationPanel() {
  const t = useTranslations('intel')

  return { t }
}
