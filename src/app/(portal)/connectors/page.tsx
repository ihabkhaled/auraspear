'use client'

import { useMemo } from 'react'
import { Plug } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PageHeader, LoadingSpinner } from '@/components/common'
import { ConnectorCard, AddConnectorCard } from '@/components/connectors'
import { useConnectors } from '@/hooks/useConnectors'
import { CONNECTOR_TYPES } from '@/lib/constants/connectors.constants'

export default function ConnectorsPage() {
  const t = useTranslations('connectors')
  const { data: connectors, isLoading, isFetching } = useConnectors()

  const list = connectors ?? []

  const unconfiguredTypes = useMemo(() => {
    const configuredTypes = new Set(list.map(c => c.type))
    return CONNECTOR_TYPES.filter(ct => !configuredTypes.has(ct))
  }, [list])

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />

      {list.length === 0 && unconfiguredTypes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Plug className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="text-lg font-semibold">{t('noConnectors')}</h3>
          <p className="text-muted-foreground mt-1 text-sm">{t('noConnectorsDescription')}</p>
        </div>
      ) : (
        <>
          {list.length > 0 && (
            <div
              className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-70' : ''}`}
            >
              {list.map(c => (
                <ConnectorCard key={c.type} connector={c} />
              ))}
            </div>
          )}

          {unconfiguredTypes.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold">{t('availableConnectors')}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {unconfiguredTypes.map(ct => (
                  <AddConnectorCard key={ct} connectorType={ct} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
