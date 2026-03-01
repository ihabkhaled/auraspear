'use client'

import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatTimestamp } from '@/lib/utils'
import { useConnectorsStore } from '@/stores/connectors.store'

export function AIGovernancePanel() {
  const t = useTranslations('connectors')
  const aiAuditLogs = useConnectorsStore(s => s.aiAuditLogs)
  const activeTenantId = useConnectorsStore(s => s.activeTenantId)

  const tenantLogs = aiAuditLogs.filter(l => l.tenantId === activeTenantId)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{t('aiAuditLog')}</CardTitle>
      </CardHeader>
      <CardContent>
        {tenantLogs.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t('noAiAuditEntries')}</p>
        ) : (
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {tenantLogs.slice(0, 20).map(entry => (
                <div
                  key={entry.id}
                  className="flex items-start justify-between rounded-md border p-3 text-sm"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{entry.action}</div>
                    <div className="text-muted-foreground text-xs">
                      {entry.model} &middot; {formatTimestamp(entry.timestamp)}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {entry.inputTokens} in / {entry.outputTokens} out &middot; {entry.latencyMs}ms
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      entry.status === 'success'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-destructive/15 text-destructive'
                    }
                  >
                    {entry.status === 'success' ? t('success') : t('failed')}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
