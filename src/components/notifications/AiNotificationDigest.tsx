'use client'

import { Loader2, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AiNotificationDigestProps, AiNotificationDigestResult } from '@/types'

function DigestResultCard({
  result,
  t,
}: {
  result: AiNotificationDigestResult
  t: (key: string) => string
}) {
  return (
    <div className="bg-muted/50 space-y-2 rounded-lg p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="text-xs">
          {`${t('aiConfidence')}: ${result.confidence}%`}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {result.provider ?? result.model}
        </Badge>
      </div>
      <p className="text-foreground scroll text-sm leading-relaxed whitespace-pre-wrap">
        {result.result}
      </p>
    </div>
  )
}

export function AiNotificationDigest({
  isLoading,
  digestResult,
  onGenerateDigest,
  availableConnectors,
  selectedConnector,
  onConnectorChange,
  tCommon,
  t,
}: AiNotificationDigestProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary h-4 w-4" />
            <CardTitle className="text-sm">{t('aiDigest')}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">{tCommon('aiConnector')}</span>
            <Select value={selectedConnector} onValueChange={onConnectorChange}>
              <SelectTrigger className="h-7 w-[160px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableConnectors.map(c => (
                  <SelectItem key={c.key} value={c.key} disabled={!c.enabled}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="secondary" size="sm" onClick={onGenerateDigest} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="me-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="me-1.5 h-3.5 w-3.5" />
            )}
            {isLoading ? t('aiDigestLoading') : t('aiGenerateDigest')}
          </Button>
        </div>
        <p className="text-muted-foreground text-xs">{t('aiDigestDescription')}</p>
      </CardHeader>
      {digestResult && (
        <CardContent>
          <DigestResultCard result={digestResult} t={t} />
        </CardContent>
      )}
    </Card>
  )
}
