'use client'

import { use } from 'react'
import { ArrowLeft, Play, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LoadingSpinner } from '@/components/common'
import { ConnectorForm, StatusBadge, SecurityIndicators } from '@/components/connectors'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useConnectorDetailPage } from '@/hooks/useConnectorDetailPage'
import { formatTimestamp } from '@/lib/utils'

interface ConnectorDetailPageProps {
  params: Promise<{ type: string }>
}

export default function ConnectorDetailPage({ params }: ConnectorDetailPageProps) {
  const { type: rawType } = use(params)
  const t = useTranslations('connectors')

  const {
    router,
    isValidType,
    isLoading,
    connector,
    type,
    meta,
    Icon,
    isEditor,
    isAdmin,
    testing,
    deletePending,
    connectorStatus,
    handleTest,
    handleDelete,
  } = useConnectorDetailPage(rawType)

  if (!isValidType) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/connectors')}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          {t('backToConnectors')}
        </Button>
        <div className="py-20 text-center">
          <h3 className="text-lg font-semibold">{t('connectorNotFound')}</h3>
          <p className="text-muted-foreground mt-1 text-sm">{t('connectorNotFoundDescription')}</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!connector || !type || !meta || !Icon) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/connectors')}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          {t('backToConnectors')}
        </Button>
        <div className="py-20 text-center">
          <h3 className="text-lg font-semibold">{t('connectorNotFound')}</h3>
          <p className="text-muted-foreground mt-1 text-sm">{t('connectorNotFoundDescription')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/connectors')}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          {t('backToConnectors')}
        </Button>
        <div className="flex items-center gap-3">
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
            <Icon className="text-muted-foreground h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{connector.name}</h1>
            <p className="text-muted-foreground text-sm">{meta.description}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('configuration')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ConnectorForm type={type} connector={connector} readOnly={!isEditor} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{t('status')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {connectorStatus && <StatusBadge status={connectorStatus} />}
              {connector.lastTestAt && (
                <p className="text-muted-foreground text-xs">
                  {t('lastTested')}: {formatTimestamp(connector.lastTestAt)}
                </p>
              )}
            </CardContent>
          </Card>

          <SecurityIndicators type={type} />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{t('actions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full justify-start"
                variant="outline"
                size="sm"
                onClick={handleTest}
                disabled={testing}
              >
                <Play className="mr-2 h-3.5 w-3.5" />
                {t('testConnection')}
              </Button>
              {isAdmin && (
                <Button
                  className="w-full justify-start"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deletePending}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  {t('deleteConnector')}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
