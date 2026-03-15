'use client'

import { Database } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDataRetention } from '@/hooks/useDataRetention'
import type { DataRetentionConfig } from '@/types'

const RETENTION_FIELDS: Array<{
  key: keyof DataRetentionConfig
  labelKey: string
  descriptionKey: string
}> = [
  {
    key: 'alertRetention',
    labelKey: 'alertRetention',
    descriptionKey: 'alertRetentionDescription',
  },
  {
    key: 'logRetention',
    labelKey: 'logRetention',
    descriptionKey: 'logRetentionDescription',
  },
  {
    key: 'incidentRetention',
    labelKey: 'incidentRetention',
    descriptionKey: 'incidentRetentionDescription',
  },
  {
    key: 'auditLogRetention',
    labelKey: 'auditLogRetention',
    descriptionKey: 'auditLogRetentionDescription',
  },
]

export default function DataRetentionCard() {
  const {
    t,
    retentionConfig,
    retentionOptions,
    isPending,
    handleRetentionChange,
    getRetentionLabel,
  } = useDataRetention()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          {t('dataRetention')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {RETENTION_FIELDS.map(({ key, labelKey, descriptionKey }) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={`retention-${key}`}>{t(labelKey)}</Label>
            <p className="text-muted-foreground text-xs">{t(descriptionKey)}</p>
            <Select
              value={retentionConfig[key]}
              onValueChange={(value: string) => handleRetentionChange(key, value)}
              disabled={isPending}
            >
              <SelectTrigger id={`retention-${key}`} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {retentionOptions.map(option => (
                  <SelectItem key={option} value={option}>
                    {getRetentionLabel(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
