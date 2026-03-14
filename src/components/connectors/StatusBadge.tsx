'use client'

import { Badge } from '@/components/ui/badge'
import { useStatusBadge } from '@/hooks/useStatusBadge'
import {
  CONNECTOR_STATUS_STYLES,
  CONNECTOR_STATUS_KEYS,
} from '@/lib/constants/connectors.constants'
import type { StatusBadgeProps } from '@/types'

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useStatusBadge()
  return (
    <Badge variant="outline" className={CONNECTOR_STATUS_STYLES[status]}>
      {t(CONNECTOR_STATUS_KEYS[status])}
    </Badge>
  )
}
