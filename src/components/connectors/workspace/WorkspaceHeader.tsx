'use client'

import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConnectorStatus } from '@/enums'
import { cn, formatTimestamp } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

const STATUS_CLASSES: Record<string, string> = {
  [ConnectorStatus.CONNECTED]: 'bg-status-success text-status-success border-status-success',
  [ConnectorStatus.DISCONNECTED]: 'bg-status-error text-status-error border-status-error',
  [ConnectorStatus.TESTING]: 'bg-status-warning text-status-warning border-status-warning',
  [ConnectorStatus.NOT_CONFIGURED]: '',
}

interface WorkspaceHeaderProps {
  name: string
  description: string
  status: string
  lastTestedAt: string | null
  Icon?: LucideIcon
  onBack: () => void
}

export function WorkspaceHeader({
  name,
  description,
  status,
  lastTestedAt,
  Icon,
  onBack,
}: WorkspaceHeaderProps) {
  const t = useTranslations('connectors')

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="me-1 h-4 w-4" />
        {t('backToConnectors')}
      </Button>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
            <Icon className="text-muted-foreground h-5 w-5" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{name}</h1>
            <Badge variant="outline" className={cn('text-[10px]', STATUS_CLASSES[status])}>
              {status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground text-sm">{description}</p>
            {lastTestedAt && (
              <span className="text-muted-foreground text-xs">
                · {t('lastTested')}: {formatTimestamp(lastTestedAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
