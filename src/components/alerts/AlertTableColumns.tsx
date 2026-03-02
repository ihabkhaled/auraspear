'use client'

import { Badge } from '@/components/ui/badge'
import { type AlertSeverity } from '@/enums'
import { getSeverityVariant } from '@/lib/severity-utils'
import { formatTimestamp, cn } from '@/lib/utils'
import type { Column, Alert, AlertColumnTranslations, GetAlertColumnsOptions } from '@/types'
import { AlertRowActions } from './AlertRowActions'

function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  return (
    <Badge variant="outline" className={cn('text-xs capitalize', getSeverityVariant(severity))}>
      {severity}
    </Badge>
  )
}

function MITREBadge({ techniques }: { techniques: string[] }) {
  const first = techniques[0]
  if (!first) {
    return <span className="text-muted-foreground text-xs">-</span>
  }

  return (
    <div className="flex items-center gap-1">
      <Badge variant="outline" className="font-mono text-xs">
        {first}
      </Badge>
      {techniques.length > 1 && (
        <span className="text-muted-foreground text-xs">+{techniques.length - 1}</span>
      )}
    </div>
  )
}

export function getAlertColumns(
  t: AlertColumnTranslations,
  options?: GetAlertColumnsOptions
): Column<Alert>[] {
  return [
    {
      key: 'timestamp',
      label: t.common('timestamp'),
      render: value => (
        <span className="text-muted-foreground font-mono text-xs whitespace-nowrap">
          {formatTimestamp(String(value))}
        </span>
      ),
    },
    {
      key: 'severity',
      label: t.common('severity'),
      render: value => <SeverityBadge severity={value as AlertSeverity} />,
    },
    {
      key: 'description',
      label: t.alerts('rule'),
      className: 'max-w-xs',
      render: value => <span className="block truncate text-sm">{String(value)}</span>,
    },
    {
      key: 'agentName',
      label: t.alerts('agent'),
      render: value => <span className="text-sm">{String(value)}</span>,
    },
    {
      key: 'sourceIp',
      label: t.alerts('sourceIp'),
      render: value => <span className="font-mono text-xs">{String(value)}</span>,
    },
    {
      key: 'mitreTechniques',
      label: t.alerts('mitre'),
      render: value => <MITREBadge techniques={value as string[]} />,
    },
    {
      key: 'actions',
      label: '',
      render: (_value, row) => (
        <AlertRowActions
          alert={row}
          onView={options?.onView}
          onInvestigate={options?.onInvestigate}
          onCreateCase={options?.onCreateCase}
          onCopyId={options?.onCopyId}
        />
      ),
    },
  ]
}
