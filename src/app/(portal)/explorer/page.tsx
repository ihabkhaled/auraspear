'use client'

import {
  FileText,
  BarChart3,
  LayoutDashboard,
  Shield,
  Monitor,
  Workflow,
  GitBranch,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Loader2,
  Settings2,
} from 'lucide-react'
import { PageHeader, LoadingSpinner, ErrorMessage } from '@/components/common'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConnectorType } from '@/enums'
import { useExplorerOverviewPage } from '@/hooks'
import { cn } from '@/lib/utils'
import type { ExplorerConnectorStatus, SyncJobStatusDetail } from '@/types'

const CONNECTOR_EXPLORER_MAP: Record<
  string,
  { icon: typeof FileText; label: string; href: string; color: string }
> = {
  [ConnectorType.GRAYLOG]: {
    icon: FileText,
    label: 'Graylog',
    href: '/explorer/logs',
    color: 'text-status-info',
  },
  [ConnectorType.GRAFANA]: {
    icon: LayoutDashboard,
    label: 'Grafana',
    href: '/explorer/dashboards',
    color: 'text-status-warning',
  },
  [ConnectorType.INFLUXDB]: {
    icon: BarChart3,
    label: 'InfluxDB',
    href: '/explorer/metrics',
    color: 'text-status-success',
  },
  [ConnectorType.MISP]: {
    icon: Shield,
    label: 'MISP',
    href: '/explorer/threat-intel',
    color: 'text-severity-critical',
  },
  [ConnectorType.VELOCIRAPTOR]: {
    icon: Monitor,
    label: 'Velociraptor',
    href: '/explorer/endpoints',
    color: 'text-severity-high',
  },
  [ConnectorType.SHUFFLE]: {
    icon: Workflow,
    label: 'Shuffle',
    href: '/explorer/automation',
    color: 'text-severity-medium',
  },
  [ConnectorType.LOGSTASH]: {
    icon: GitBranch,
    label: 'Logstash',
    href: '/explorer/pipelines',
    color: 'text-severity-low',
  },
}

function ConnectorCard({
  connector,
  meta,
  onClick,
  t,
}: {
  connector: ExplorerConnectorStatus
  meta: (typeof CONNECTOR_EXPLORER_MAP)[string]
  onClick: () => void
  t: ReturnType<typeof useExplorerOverviewPage>['t']
}) {
  const Icon = meta.icon

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <CardContent className="flex items-center gap-4 pt-6">
        <div className={cn('bg-muted rounded-lg p-3', meta.color)}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{meta.label}</p>
          <p className="text-muted-foreground text-xs">
            {connector.enabled ? t('overview.connected') : t('overview.notConfigured')}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge variant={connector.enabled ? 'default' : 'secondary'}>
            {connector.enabled ? t('overview.enabled') : t('overview.disabled')}
          </Badge>
          <Badge
            variant={connector.configured ? 'default' : 'destructive'}
            className={cn('gap-1 text-xs', connector.configured && 'bg-status-success text-white')}
          >
            <Settings2 className="h-3 w-3" />
            {connector.configured ? t('overview.configured') : t('overview.notConfigured')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ExplorerOverviewPage() {
  const { t, router, data, isLoading, error } = useExplorerOverviewPage()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={t('overview.loadError')} />

  const overview = data?.data
  const connectors = overview?.connectors ?? []
  const defaultDetail: SyncJobStatusDetail = { count: 0, connectors: [] }
  const summary = overview?.syncJobsSummary ?? {
    running: defaultDetail,
    completed: defaultDetail,
    failed: defaultDetail,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('overview.title')}
        description={t('overview.description')}
        action={{
          label: t('overview.syncJobs'),
          icon: <RefreshCw className="h-4 w-4" />,
          onClick: () => router.push('/explorer/sync-jobs'),
        }}
      />

      {/* Sync Jobs Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('overview.running')}</CardTitle>
            <Loader2 className="text-status-info h-4 w-4 animate-spin" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary.running.count}</p>
            {summary.running.connectors.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {summary.running.connectors.map(c => (
                  <Badge key={c} variant="secondary" className="text-xs capitalize">
                    {c}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('overview.completed')}</CardTitle>
            <CheckCircle2 className="text-status-success h-4 w-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary.completed.count}</p>
            {summary.completed.connectors.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {summary.completed.connectors.map(c => (
                  <Badge
                    key={c}
                    variant="default"
                    className="bg-status-success text-xs text-white capitalize"
                  >
                    {c}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('overview.failed')}</CardTitle>
            <XCircle className="text-status-error h-4 w-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary.failed.count}</p>
            {summary.failed.connectors.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {summary.failed.connectors.map(c => (
                  <Badge key={c} variant="destructive" className="text-xs capitalize">
                    {c}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Connector Cards */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">{t('overview.connectors')}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {connectors
            .filter(c => c.type in CONNECTOR_EXPLORER_MAP)
            .map(connector => {
              const meta = CONNECTOR_EXPLORER_MAP[connector.type]
              if (!meta) return null
              return (
                <ConnectorCard
                  key={connector.type}
                  connector={connector}
                  meta={meta}
                  onClick={() => router.push(meta.href)}
                  t={t}
                />
              )
            })}
        </div>
      </div>
    </div>
  )
}
