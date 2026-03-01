'use client'

import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CONNECTOR_META } from '@/lib/types/connectors'
import { formatTimestamp } from '@/lib/utils'
import { useConnectorsStore } from '@/stores/connectors.store'

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  update: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  delete: 'bg-destructive/15 text-destructive',
  test: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  enable: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  disable: 'bg-muted text-muted-foreground',
  reset: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
}

export function AuditLogViewer() {
  const t = useTranslations('connectors')
  const auditLogs = useConnectorsStore(s => s.auditLogs)
  const activeTenantId = useConnectorsStore(s => s.activeTenantId)

  const tenantLogs = auditLogs.filter(l => l.tenantId === activeTenantId)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{t('auditLog')}</CardTitle>
      </CardHeader>
      <CardContent>
        {tenantLogs.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t('noAuditEntries')}</p>
        ) : (
          <ScrollArea className="h-72">
            <div className="space-y-2">
              {tenantLogs.slice(0, 30).map(entry => (
                <div
                  key={entry.id}
                  className="flex items-start justify-between gap-3 rounded-md border p-3 text-sm"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={ACTION_COLORS[entry.action] ?? 'bg-muted text-muted-foreground'}
                      >
                        {entry.action}
                      </Badge>
                      <span className="font-medium">
                        {CONNECTOR_META[entry.connectorType].label}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {entry.actor} ({entry.role}) &middot; {formatTimestamp(entry.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
