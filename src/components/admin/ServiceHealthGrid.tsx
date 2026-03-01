'use client'

import { useTranslations } from 'next-intl'
import { Server } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { ServiceHealthCard } from './ServiceHealthCard'
import type { ServiceHealth } from '@/types'

interface ServiceHealthGridProps {
  services: ServiceHealth[]
}

export function ServiceHealthGrid({ services }: ServiceHealthGridProps) {
  const t = useTranslations('admin')

  if (services.length === 0) {
    return (
      <EmptyState
        icon={<Server className="h-6 w-6" />}
        title={t('services.noServices')}
        description={t('services.noServicesDescription')}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {services.map(service => (
        <ServiceHealthCard key={service.id} service={service} />
      ))}
    </div>
  )
}
