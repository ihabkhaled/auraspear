'use client'

import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { type ConnectorStatus } from '@/enums'
import {
  CONNECTOR_STATUS_STYLES,
  CONNECTOR_STATUS_KEYS,
} from '@/lib/constants/connectors.constants'

interface StatusBadgeProps {
  status: ConnectorStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const t = useTranslations('connectors')
  return (
    <Badge variant="outline" className={CONNECTOR_STATUS_STYLES[status]}>
      {t(CONNECTOR_STATUS_KEYS[status])}
    </Badge>
  )
}
