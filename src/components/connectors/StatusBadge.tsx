'use client'

import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import type { ConnectorStatus } from '@/lib/types/connectors'

const STATUS_STYLES: Record<ConnectorStatus, string> = {
  not_configured: 'bg-muted text-muted-foreground',
  connected: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  disconnected: 'bg-destructive/15 text-destructive',
  testing: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 animate-pulse',
}

const STATUS_KEYS: Record<ConnectorStatus, string> = {
  not_configured: 'statusNotConfigured',
  connected: 'statusConnected',
  disconnected: 'statusDisconnected',
  testing: 'statusTesting',
}

interface StatusBadgeProps {
  status: ConnectorStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const t = useTranslations('connectors')
  return (
    <Badge variant="outline" className={STATUS_STYLES[status]}>
      {t(STATUS_KEYS[status])}
    </Badge>
  )
}
