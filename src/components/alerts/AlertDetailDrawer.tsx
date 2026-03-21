'use client'

import { AlertTriangle, Brain, Briefcase, X } from 'lucide-react'
import { AiTriagePanel } from '@/components/alerts/AiTriagePanel'
import { AlertTimeline } from '@/components/alerts/AlertTimeline'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type AlertStatus } from '@/enums'
import { useAlertDetailDrawer } from '@/hooks'
import { ALERT_STATUS_CLASSES } from '@/lib/constants/alerts'
import { getSeverityClass } from '@/lib/severity-utils'
import { formatTimestamp, cn, lookup } from '@/lib/utils'
import type { AlertDetailDrawerProps } from '@/types'

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-muted-foreground shrink-0 text-xs font-medium">{label}</span>
      <div className="text-end text-sm">{children}</div>
    </div>
  )
}

export function AlertDetailDrawer({
  alert,
  open,
  onOpenChange,
  onInvestigate,
  onCreateCase,
  onEscalateToIncident,
  onClose,
  triageProps,
}: AlertDetailDrawerProps) {
  const { t, tCommon, getStatusLabel } = useAlertDetailDrawer()

  if (!alert) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn('text-xs capitalize', getSeverityClass(alert.severity))}
            >
              {alert.severity}
            </Badge>
            <span className="text-muted-foreground text-xs">
              {formatTimestamp(alert.timestamp)}
            </span>
          </div>
          <SheetTitle className="text-base">{alert.title}</SheetTitle>
          <SheetDescription className="text-muted-foreground font-mono text-xs">
            {alert.ruleId}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-hidden px-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList variant="line" className="w-full">
              <TabsTrigger value="overview">{t('viewDetail')}</TabsTrigger>
              <TabsTrigger value="timeline">{t('timeline')}</TabsTrigger>
              <TabsTrigger value="mitre">{t('mitre')}</TabsTrigger>
              <TabsTrigger value="raw">{t('rawEvent')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-1 pt-4">
              <DetailRow label={t('agent')}>
                <span>{alert.agentName}</span>
              </DetailRow>
              <Separator />
              <DetailRow label={t('sourceIp')}>
                <span className="font-mono text-xs">{alert.sourceIp}</span>
              </DetailRow>
              <Separator />
              <DetailRow label={t('destIp')}>
                <span className="font-mono text-xs">{alert.destinationIp}</span>
              </DetailRow>
              <Separator />
              <DetailRow label={t('rule')}>
                <span>{alert.ruleName}</span>
              </DetailRow>
              <Separator />
              <DetailRow label={t('source')}>
                <span className="text-xs capitalize">{alert.source}</span>
              </DetailRow>
              <Separator />
              <DetailRow label={tCommon('status')}>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs',
                    lookup(ALERT_STATUS_CLASSES, alert.status as AlertStatus) ??
                      'border-muted-foreground text-muted-foreground'
                  )}
                >
                  {getStatusLabel(alert.status)}
                </Badge>
              </DetailRow>
              {alert.acknowledgedBy && (
                <>
                  <Separator />
                  <DetailRow label={t('acknowledgedBy')}>
                    <span className="text-xs">{alert.acknowledgedBy}</span>
                  </DetailRow>
                </>
              )}
              {alert.acknowledgedAt && (
                <>
                  <Separator />
                  <DetailRow label={t('acknowledgedAt')}>
                    <span className="text-xs">{formatTimestamp(alert.acknowledgedAt)}</span>
                  </DetailRow>
                </>
              )}
              {alert.closedBy && (
                <>
                  <Separator />
                  <DetailRow label={t('closedBy')}>
                    <span className="text-xs">{alert.closedBy}</span>
                  </DetailRow>
                </>
              )}
              {alert.closedAt && (
                <>
                  <Separator />
                  <DetailRow label={t('closedAt')}>
                    <span className="text-xs">{formatTimestamp(alert.closedAt)}</span>
                  </DetailRow>
                </>
              )}
              {alert.resolution && (
                <>
                  <Separator />
                  <DetailRow label={t('resolution')}>
                    <span className="text-xs">{alert.resolution}</span>
                  </DetailRow>
                </>
              )}
              <Separator />
              <DetailRow label={t('createdAt')}>
                <span className="text-xs">{formatTimestamp(alert.createdAt)}</span>
              </DetailRow>
              <Separator />
              <DetailRow label={t('updatedAt')}>
                <span className="text-xs">{formatTimestamp(alert.updatedAt)}</span>
              </DetailRow>
              {triageProps && (
                <>
                  <Separator className="my-3" />
                  <AiTriagePanel alertId={alert.id} t={t} {...triageProps} />
                </>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="pt-4">
              <AlertTimeline alert={alert} />
            </TabsContent>

            <TabsContent value="mitre" className="pt-4">
              <div className="space-y-3">
                <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  {t('mitre')}
                </h4>
                {alert.mitreTechniques.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {alert.mitreTechniques.map(technique => (
                      <Badge key={technique} variant="outline" className="font-mono text-xs">
                        {technique}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">{tCommon('noData')}</p>
                )}

                {alert.mitreTactics.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex flex-wrap gap-2">
                      {alert.mitreTactics.map(tactic => (
                        <Badge key={tactic} variant="secondary" className="text-xs">
                          {tactic}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="raw" className="pt-4">
              {alert.rawEvent ? (
                <pre className="bg-muted max-h-96 overflow-auto rounded-lg p-4 font-mono text-xs">
                  {JSON.stringify(alert.rawEvent, null, 2)}
                </pre>
              ) : (
                <p className="text-muted-foreground text-sm">{t('noRawEvent')}</p>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <SheetFooter className="grid grid-cols-2 gap-2 sm:flex sm:flex-row">
          {onInvestigate && (
            <Button variant="default" size="sm" onClick={() => onInvestigate(alert)}>
              <Brain className="h-4 w-4" />
              {t('investigate')}
            </Button>
          )}
          {onCreateCase && (
            <Button variant="outline" size="sm" onClick={() => onCreateCase(alert)}>
              <Briefcase className="h-4 w-4" />
              {t('createCase')}
            </Button>
          )}
          {onEscalateToIncident && (
            <Button variant="outline" size="sm" onClick={() => onEscalateToIncident(alert)}>
              <AlertTriangle className="h-4 w-4" />
              {t('escalate')}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onClose?.(alert)}
            className="col-span-2 sm:col-span-1"
          >
            <X className="h-4 w-4" />
            {tCommon('close')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
