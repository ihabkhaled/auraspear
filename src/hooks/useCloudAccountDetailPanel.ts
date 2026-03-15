import { useTranslations } from 'next-intl'
import type { CloudAccountDetailPanelProps } from '@/types'

export function useCloudAccountDetailPanel({
  account,
}: Pick<CloudAccountDetailPanelProps, 'account'>) {
  const t = useTranslations('cloudSecurity')
  const tCommon = useTranslations('common')

  const hasData = account !== null

  return { t, tCommon, hasData }
}
