'use client'

import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatTimestamp } from '@/lib/utils'
import type { AppLogDetailDialogProps } from '@/types'

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="border-border grid grid-cols-3 gap-2 border-b py-2 text-sm">
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className="col-span-2 font-mono text-xs break-all">{value}</span>
    </div>
  )
}

function getLevelClasses(level: string): string {
  switch (level) {
    case 'error':
      return 'bg-status-error text-white border-status-error'
    case 'warn':
      return 'bg-status-warning text-white border-status-warning'
    case 'info':
      return 'bg-status-info text-white border-status-info'
    case 'debug':
      return 'bg-muted text-muted-foreground border-border'
    default:
      return ''
  }
}

export function AppLogDetailDialog({ log, open, onClose }: AppLogDetailDialogProps) {
  const t = useTranslations('admin')

  if (!log) return null

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen) onClose()
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge variant="outline" className={`text-xs uppercase ${getLevelClasses(log.level)}`}>
              {log.level}
            </Badge>
            <span className="truncate">{t('appLogs.logDetail')}</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-1">
            <DetailRow label={t('appLogs.timestamp')} value={formatTimestamp(log.createdAt)} />
            <DetailRow label={t('appLogs.message')} value={log.message} />
            <DetailRow label={t('appLogs.feature')} value={log.feature} />
            <DetailRow label={t('appLogs.action')} value={log.action} />
            <DetailRow label={t('appLogs.functionName')} value={log.functionName} />
            <DetailRow label={t('appLogs.className')} value={log.className} />
            <DetailRow label={t('appLogs.actorEmail')} value={log.actorEmail} />
            <DetailRow label={t('appLogs.actorUserId')} value={log.actorUserId} />
            <DetailRow label={t('appLogs.tenantId')} value={log.tenantId} />
            <DetailRow label={t('appLogs.requestId')} value={log.requestId} />
            <DetailRow label={t('appLogs.targetResource')} value={log.targetResource} />
            <DetailRow label={t('appLogs.targetResourceId')} value={log.targetResourceId} />
            <DetailRow label={t('appLogs.outcome')} value={log.outcome} />
            <DetailRow label={t('appLogs.sourceType')} value={log.sourceType} />
            <DetailRow label={t('appLogs.ipAddress')} value={log.ipAddress} />
            <DetailRow label={t('appLogs.httpMethod')} value={log.httpMethod} />
            <DetailRow label={t('appLogs.httpRoute')} value={log.httpRoute} />
            <DetailRow
              label={t('appLogs.httpStatusCode')}
              value={log.httpStatusCode?.toString() ?? null}
            />

            {log.metadata && Object.keys(log.metadata).length > 0 && (
              <div className="border-border border-b py-2">
                <span className="text-muted-foreground text-sm font-medium">
                  {t('appLogs.metadata')}
                </span>
                <pre className="bg-muted mt-1 overflow-x-auto rounded p-2 font-mono text-xs">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            )}

            {log.stackTrace && (
              <div className="border-border border-b py-2">
                <span className="text-muted-foreground text-sm font-medium">
                  {t('appLogs.stackTrace')}
                </span>
                <pre className="bg-muted text-status-error mt-1 overflow-x-auto rounded p-2 font-mono text-xs">
                  {log.stackTrace}
                </pre>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
