'use client'

import { Brain, Briefcase, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
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
import { AlertStatus } from '@/enums'
import { ALERT_STATUS_CLASSES } from '@/lib/constants/alerts'
import { getSeverityClass } from '@/lib/severity-utils'
import { formatTimestamp, cn } from '@/lib/utils'
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
  onClose,
}: AlertDetailDrawerProps) {
  const t = useTranslations('alerts')
  const tCommon = useTranslations('common')

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case AlertStatus.NEW_ALERT:
        return t('statusNewAlert')
      case AlertStatus.ACKNOWLEDGED:
        return t('statusAcknowledged')
      case AlertStatus.IN_PROGRESS:
        return t('statusInProgress')
      case AlertStatus.RESOLVED:
        return t('statusResolved')
      case AlertStatus.CLOSED:
        return t('statusClosed')
      case AlertStatus.FALSE_POSITIVE:
        return t('statusFalsePositive')
      default:
        return status
    }
  }

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
          <SheetTitle className="text-base">{alert.description}</SheetTitle>
          <SheetDescription className="text-muted-foreground font-mono text-xs">
            {alert.ruleId}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList variant="line" className="w-full">
              <TabsTrigger value="overview">{t('viewDetail')}</TabsTrigger>
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
              <DetailRow label={tCommon('status')}>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs',
                    ALERT_STATUS_CLASSES[alert.status as AlertStatus] ??
                      'border-muted-foreground text-muted-foreground'
                  )}
                >
                  {getStatusLabel(alert.status)}
                </Badge>
              </DetailRow>
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
              <pre className="bg-muted max-h-96 overflow-auto rounded-lg p-4 font-mono text-xs">
                {JSON.stringify(alert.rawEvent, null, 2)}
              </pre>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <SheetFooter className="flex-row gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => onInvestigate?.(alert)}
            className="flex-1"
          >
            <Brain className="h-4 w-4" />
            {t('investigate')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCreateCase?.(alert)}
            className="flex-1"
          >
            <Briefcase className="h-4 w-4" />
            {t('createCase')}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onClose?.(alert)}>
            <X className="h-4 w-4" />
            {tCommon('close')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
