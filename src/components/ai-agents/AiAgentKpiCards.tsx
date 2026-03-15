'use client'

import { Bot, Wifi, Zap, Hash, DollarSign } from 'lucide-react'
import { KPICard } from '@/components/common'
import { useAiAgentKpiCards } from '@/hooks/useAiAgentKpiCards'
import type { AiAgentKpiCardsProps } from '@/types'

export function AiAgentKpiCards(props: AiAgentKpiCardsProps) {
  const { t, totalAgents, onlineAgents, totalSessions, formattedTokens, formattedCost } =
    useAiAgentKpiCards(props)

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <KPICard
        label={t('kpiTotalAgents')}
        value={totalAgents}
        icon={<Bot className="h-5 w-5" />}
        accentColor="var(--primary)"
      />
      <KPICard
        label={t('kpiOnline')}
        value={onlineAgents}
        icon={<Wifi className="h-5 w-5" />}
        accentColor="var(--status-success)"
      />
      <KPICard
        label={t('kpiTotalSessions')}
        value={totalSessions}
        icon={<Zap className="h-5 w-5" />}
        accentColor="var(--status-info)"
      />
      <KPICard
        label={t('kpiTotalTokens')}
        value={formattedTokens}
        icon={<Hash className="h-5 w-5" />}
        accentColor={undefined}
      />
      <KPICard
        label={t('kpiTotalCost')}
        value={formattedCost}
        icon={<DollarSign className="h-5 w-5" />}
        accentColor="var(--status-warning)"
      />
    </div>
  )
}
