'use client'

import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { CaseCycleStatus } from '@/enums'

interface CycleBadgeProps {
  status: CaseCycleStatus
}

export function CycleBadge({ status }: CycleBadgeProps) {
  const t = useTranslations('cases.cycles')

  if (status === CaseCycleStatus.ACTIVE) {
    return <Badge className="bg-status-success text-white">{t('statusActive')}</Badge>
  }

  return <Badge variant="secondary">{t('statusClosed')}</Badge>
}
