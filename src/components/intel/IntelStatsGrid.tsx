'use client'

import { Users, Globe, FileText, Link } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { KPICard } from '@/components/common/KPICard'
import type { IntelStatsGridProps } from '@/types'

export function IntelStatsGrid({ stats }: IntelStatsGridProps) {
  const t = useTranslations('intel')

  const cards = [
    {
      label: t('stats.threatActors'),
      value: stats.threatActors,
      trend: stats.threatActorsTrend,
      icon: <Users className="h-5 w-5" />,
      accentColor: 'var(--chart-1)',
    },
    {
      label: t('stats.ipIOCs'),
      value: stats.ipIOCs,
      trend: stats.ipIOCsTrend,
      icon: <Globe className="h-5 w-5" />,
      accentColor: 'var(--chart-2)',
    },
    {
      label: t('stats.fileHashes'),
      value: stats.fileHashes,
      trend: stats.fileHashesTrend,
      icon: <FileText className="h-5 w-5" />,
      accentColor: 'var(--chart-3)',
    },
    {
      label: t('stats.activeDomains'),
      value: stats.activeDomains,
      trend: stats.activeDomainsTrend,
      icon: <Link className="h-5 w-5" />,
      accentColor: 'var(--chart-4)',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(card => (
        <KPICard
          key={card.label}
          label={card.label}
          value={card.value}
          trend={card.trend}
          icon={card.icon}
          accentColor={card.accentColor}
        />
      ))}
    </div>
  )
}
