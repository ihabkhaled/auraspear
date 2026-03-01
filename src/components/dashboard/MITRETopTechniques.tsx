'use client'

import { useTranslations } from 'next-intl'
import { Swords } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { EmptyState } from '@/components/common/EmptyState'
import { DashboardCard } from './DashboardCard'
import type { MITRETechnique } from '@/types'

interface MITRETopTechniquesProps {
  techniques: MITRETechnique[]
  className?: string
}

export function MITRETopTechniques({ techniques, className }: MITRETopTechniquesProps) {
  const t = useTranslations('dashboard')

  if (techniques.length === 0) {
    return (
      <DashboardCard title={t('mitreTopTechniques')} className={className}>
        <EmptyState
          icon={<Swords className="h-6 w-6" />}
          title={t('mitreEmptyTitle')}
          description={t('mitreEmptyDescription')}
          className="py-6"
        />
      </DashboardCard>
    )
  }

  return (
    <DashboardCard title={t('mitreTopTechniques')} className={className}>
      <div className="space-y-3">
        {techniques.map((technique) => (
          <div key={technique.id} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  {technique.id}
                </span>
                <span className="font-medium text-foreground">
                  {technique.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {technique.count}
                </span>
                <span className="text-xs font-medium text-foreground w-10 text-end">
                  {technique.percentage}%
                </span>
              </div>
            </div>
            <Progress value={technique.percentage} className="h-1.5" />
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
