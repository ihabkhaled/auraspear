'use client'

import { Shield, KeyRound, Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ConnectorType } from '@/enums'
import { SECURITY_POSTURE } from '@/lib/constants/connectors.constants'

interface SecurityIndicatorsProps {
  type: ConnectorType
}

export function SecurityIndicators({ type }: SecurityIndicatorsProps) {
  const t = useTranslations('connectors')
  const posture = SECURITY_POSTURE[type]

  const indicators = [
    { label: t('mTLS'), enabled: posture.mTLS, icon: Shield },
    { label: t('iam'), enabled: posture.iam, icon: KeyRound },
    { label: t('encryption'), enabled: posture.encryption, icon: Lock },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{t('securityPosture')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {indicators.map(ind => {
            const Icon = ind.icon
            return (
              <Badge
                key={ind.label}
                variant="outline"
                className={
                  ind.enabled
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : 'bg-muted text-muted-foreground'
                }
              >
                <Icon className="mr-1 h-3 w-3" />
                {ind.label}: {ind.enabled ? t('active') : t('notApplicable')}
              </Badge>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
