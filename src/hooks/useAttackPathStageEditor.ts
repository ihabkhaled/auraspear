import { useTranslations } from 'next-intl'

export function useAttackPathStageEditor() {
  const t = useTranslations('attackPath')

  return {
    t,
  }
}
