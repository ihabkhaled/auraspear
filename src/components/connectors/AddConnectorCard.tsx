'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAddConnectorCard } from '@/hooks/useAddConnectorCard'
import { CONNECTOR_ICONS, CONNECTOR_META } from '@/lib/constants/connectors.constants'
import type { AddConnectorCardProps } from '@/types'

export function AddConnectorCard({ connectorType }: AddConnectorCardProps) {
  const { router, t } = useAddConnectorCard()

  const Icon = CONNECTOR_ICONS[connectorType]
  const meta = CONNECTOR_META[connectorType]

  return (
    <Card className="border-dashed opacity-60 transition-opacity hover:opacity-100">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
            <Icon className="text-muted-foreground h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base">{meta.label}</CardTitle>
            <CardDescription>{t(meta.descriptionKey)}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/connectors/${connectorType}?create=true`)}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          {t('addConnector')}
        </Button>
      </CardContent>
    </Card>
  )
}
