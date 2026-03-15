import { useTranslations } from 'next-intl'

export function useAttackPathFilters() {
  const t = useTranslations('attackPath')
  const tCommon = useTranslations('common')

  return {
    t,
    tCommon,
  }
}
