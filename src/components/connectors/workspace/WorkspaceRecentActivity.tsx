'use client'

import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertSeverity } from '@/enums'
import { cn, formatTimestamp } from '@/lib/utils'
import type { WorkspaceRecentItem } from '@/types'

const SEVERITY_CLASSES: Record<AlertSeverity, string> = {
  [AlertSeverity.CRITICAL]: 'bg-severity-critical text-white',
  [AlertSeverity.HIGH]: 'bg-severity-high text-white',
  [AlertSeverity.MEDIUM]: 'bg-severity-medium text-white',
  [AlertSeverity.LOW]: 'bg-severity-low',
  [AlertSeverity.INFO]: 'bg-severity-info',
}

interface WorkspaceRecentActivityProps {
  items: WorkspaceRecentItem[]
  loading?: boolean
  title?: string
}

export function WorkspaceRecentActivity({ items, loading, title }: WorkspaceRecentActivityProps) {
  const t = useTranslations('connectors.workspace')

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{title ?? t('recentActivity')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="bg-muted h-12 animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title ?? t('recentActivity')}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">{t('noRecentActivity')}</p>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div
                key={item.id}
                className={cn(
                  'border-border flex items-start gap-3 rounded-lg border p-3 transition-colors',
                  'hover:bg-muted/50'
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    {item.severity && (
                      <Badge
                        variant="outline"
                        className={cn('shrink-0 text-[10px]', SEVERITY_CLASSES[item.severity])}
                      >
                        {item.severity}
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-muted-foreground mt-0.5 truncate text-xs">
                      {item.description}
                    </p>
                  )}
                  {item.timestamp && (
                    <p className="text-muted-foreground mt-1 text-[10px]">
                      {formatTimestamp(item.timestamp)}
                    </p>
                  )}
                </div>
                {item.type && (
                  <Badge variant="outline" className="shrink-0 text-[10px]">
                    {item.type}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
