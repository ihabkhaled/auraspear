'use client'

import { type CloudAccountStatus, type CloudProvider, SortOrder } from '@/enums'
import {
  CLOUD_ACCOUNT_STATUS_CLASSES,
  CLOUD_ACCOUNT_STATUS_LABEL_KEYS,
  CLOUD_PROVIDER_LABEL_KEYS,
} from '@/lib/constants/cloud-security'
import { formatRelativeTime, cn } from '@/lib/utils'
import type { CloudAccount, Column } from '@/types'

interface CloudSecurityColumnTranslations {
  cloudSecurity: (key: string) => string
  common: (key: string) => string
}

export function getCloudSecurityColumns(
  t: CloudSecurityColumnTranslations
): Column<CloudAccount>[] {
  return [
    {
      key: 'name',
      label: t.common('name'),
      sortable: true,
      render: (value: unknown) => <span className="text-sm font-medium">{String(value)}</span>,
    },
    {
      key: 'provider',
      label: t.cloudSecurity('columnProvider'),
      sortable: true,
      render: (value: unknown) => {
        const provider = value as CloudProvider
        const labelKey = CLOUD_PROVIDER_LABEL_KEYS[provider]
        return (
          <span className="text-muted-foreground text-xs uppercase">
            {labelKey ? t.cloudSecurity(labelKey) : String(value)}
          </span>
        )
      },
    },
    {
      key: 'accountId',
      label: t.cloudSecurity('columnAccountId'),
      render: (value: unknown) => <span className="font-mono text-xs">{String(value)}</span>,
    },
    {
      key: 'status',
      label: t.common('status'),
      sortable: true,
      render: (value: unknown) => {
        const status = value as CloudAccountStatus
        const labelKey = CLOUD_ACCOUNT_STATUS_LABEL_KEYS[status]
        return (
          <span
            className={cn(
              'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
              CLOUD_ACCOUNT_STATUS_CLASSES[status]
            )}
          >
            {labelKey ? t.cloudSecurity(labelKey) : String(value)}
          </span>
        )
      },
    },
    {
      key: 'totalFindings',
      label: t.cloudSecurity('columnFindings'),
      sortable: true,
      render: (value: unknown) => (
        <span className="text-muted-foreground text-xs">{Number(value).toLocaleString()}</span>
      ),
    },
    {
      key: 'criticalFindings',
      label: t.cloudSecurity('columnCritical'),
      sortable: true,
      render: (value: unknown) => {
        const count = Number(value)
        return (
          <span
            className={cn(
              'text-xs font-medium',
              count > 0 ? 'text-severity-critical' : 'text-muted-foreground'
            )}
          >
            {count.toLocaleString()}
          </span>
        )
      },
    },
    {
      key: 'lastScanAt',
      label: t.cloudSecurity('columnLastScan'),
      sortable: true,
      defaultSortOrder: SortOrder.DESC,
      render: (value: unknown) => (
        <span className="text-muted-foreground text-xs whitespace-nowrap">
          {value ? formatRelativeTime(String(value)) : '-'}
        </span>
      ),
    },
  ]
}
