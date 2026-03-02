'use client'

import { Plug } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PageHeader, LoadingSpinner } from '@/components/common'
import { ConnectorCard } from '@/components/connectors'
import { useConnectors } from '@/hooks/useConnectors'

export default function ConnectorsPage() {
  const t = useTranslations('connectors')
  const { data: connectors, isLoading, isFetching } = useConnectors()

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  const list = connectors ?? []

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Plug className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="text-lg font-semibold">{t('noConnectors')}</h3>
          <p className="text-muted-foreground mt-1 text-sm">{t('noConnectorsDescription')}</p>
        </div>
      ) : (
        <div
          className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-70' : ''}`}
        >
          {list.map(c => (
            <ConnectorCard key={c.type} connector={c} />
          ))}
        </div>
      )}
    </div>
  )
}
