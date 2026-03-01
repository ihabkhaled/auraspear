'use client'

import { useTranslations } from 'next-intl'
import { Activity } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { DashboardCard } from './DashboardCard'
import { cn } from '@/lib/utils'
import type { PipelineService } from '@/types'

interface PipelineHealthBarProps {
  services: PipelineService[]
  className?: string
}

function StatusDot({ healthy }: { healthy: boolean }) {
  return (
    <span
      className={cn(
        'inline-block h-2 w-2 rounded-full shrink-0',
        healthy ? 'bg-status-success' : 'bg-status-error'
      )}
    />
  )
}

export function PipelineHealthBar({ services, className }: PipelineHealthBarProps) {
  const t = useTranslations('dashboard')

  if (services.length === 0) {
    return (
      <DashboardCard title={t('pipelineHealth')} className={className}>
        <EmptyState
          icon={<Activity className="h-6 w-6" />}
          title={t('pipelineEmptyTitle')}
          description={t('pipelineEmptyDescription')}
          className="py-6"
        />
      </DashboardCard>
    )
  }

  return (
    <DashboardCard title={t('pipelineHealth')} className={className}>
      <div className="flex flex-wrap gap-4">
        {services.map((service) => (
          <div key={service.name} className="flex items-center gap-2">
            <StatusDot healthy={service.healthy} />
            <span className="text-sm text-foreground">{service.name}</span>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
