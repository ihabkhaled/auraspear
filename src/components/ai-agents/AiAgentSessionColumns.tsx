'use client'

import type { AiAgentSession, Column, SessionColumnTranslations } from '@/types'

export function getAiAgentSessionColumns(t: SessionColumnTranslations): Column<AiAgentSession>[] {
  return [
    {
      key: 'input',
      label: t('sessionInput'),
      render: (value: unknown) => (
        <span className="max-w-[200px] truncate text-sm">{String(value ?? '')}</span>
      ),
    },
    {
      key: 'status',
      label: t('colStatus'),
      className: 'w-24',
      render: (value: unknown) => <span className="text-xs capitalize">{String(value ?? '')}</span>,
    },
    {
      key: 'output',
      label: t('sessionOutput'),
      render: (value: unknown) => (
        <span className="max-w-[240px] truncate text-sm">{String(value ?? '') || '—'}</span>
      ),
    },
    {
      key: 'tokensUsed',
      label: t('colTokens'),
      className: 'w-24 text-end',
      render: (value: unknown) => (
        <span className="font-mono text-xs">{Number(value ?? 0).toLocaleString()}</span>
      ),
    },
    {
      key: 'cost',
      label: t('colCost'),
      className: 'w-20 text-end',
      render: (value: unknown) => (
        <span className="font-mono text-xs">{`$${Number(value ?? 0).toFixed(4)}`}</span>
      ),
    },
    {
      key: 'startedAt',
      label: t('sessionStarted'),
      className: 'w-36',
      render: (value: unknown) => (
        <span className="text-muted-foreground text-xs">
          {value ? new Date(String(value)).toLocaleString() : '-'}
        </span>
      ),
    },
  ]
}
