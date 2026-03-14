import { useTranslations } from 'next-intl'

export function useExplorerConnectorCard() {
  const t = useTranslations('explorer')

  return { t }
}
