'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Play,
  RotateCcw,
  Trash2,
  Copy,
  Shield,
  FileText,
  Crosshair,
  BarChart3,
  Database,
  Radar,
  Zap,
  Brain,
  type LucideIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import {
  ConnectorForm,
  StatusBadge,
  TestLogs,
  SecurityIndicators,
  AIGovernancePanel,
  AuditLogViewer,
} from '@/components/connectors'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { testConnector, resetConnector, deleteConnector } from '@/lib/api/connectors.api'
import { isConnectorType, CONNECTOR_META, canEdit, canDelete } from '@/lib/types/connectors'
import type { ConnectorType } from '@/lib/types/connectors'
import { formatTimestamp, copyToClipboard } from '@/lib/utils'
import { useConnectorsStore } from '@/stores/connectors.store'

const CONNECTOR_ICONS: Record<ConnectorType, LucideIcon> = {
  wazuh: Shield,
  graylog: FileText,
  velociraptor: Crosshair,
  grafana: BarChart3,
  influxdb: Database,
  misp: Radar,
  shuffle: Zap,
  bedrock: Brain,
}

interface ConnectorDetailPageProps {
  params: Promise<{ type: string }>
}

export default function ConnectorDetailPage({ params }: ConnectorDetailPageProps) {
  const { type: rawType } = use(params)
  const router = useRouter()
  const t = useTranslations('connectors')
  const [testing, setTesting] = useState(false)

  const role = useConnectorsStore(s => s.role)
  const activeTenantId = useConnectorsStore(s => s.activeTenantId)
  const addAuditLog = useConnectorsStore(s => s.addAuditLog)
  const connectorsByTenant = useConnectorsStore(s => s.connectorsByTenant)
  const list = connectorsByTenant[activeTenantId] ?? []
  const connector = list.find(c => c.type === rawType)

  const isEditor = canEdit(role)
  const isAdmin = canDelete(role)

  if (!isConnectorType(rawType) || !connector) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/connectors')}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          {t('backToConnectors')}
        </Button>
        <div className="py-20 text-center">
          <h3 className="text-lg font-semibold">{t('connectorNotFound')}</h3>
          <p className="text-muted-foreground mt-1 text-sm">{t('connectorNotFoundDescription')}</p>
        </div>
      </div>
    )
  }

  const type = rawType
  const meta = CONNECTOR_META[type]
  const Icon = CONNECTOR_ICONS[type]

  const handleTest = async () => {
    setTesting(true)
    toast.info(t('testingConnector', { name: meta.label }))
    addAuditLog({
      tenantId: activeTenantId,
      actor: `${role.toLowerCase()}@aura.io`,
      role,
      action: 'test',
      connectorType: type,
      details: `Tested ${meta.label}`,
    })
    await testConnector(type)
    setTesting(false)
    const updated = useConnectorsStore.getState().getByType(type)
    if (updated?.lastTestOk) {
      toast.success(`${meta.label} ${t('connectedSuccessfully')}`)
    } else {
      toast.error(updated?.lastError ?? t('connectionFailed'))
    }
  }

  const handleReset = () => {
    resetConnector(type)
    addAuditLog({
      tenantId: activeTenantId,
      actor: `${role.toLowerCase()}@aura.io`,
      role,
      action: 'reset',
      connectorType: type,
      details: `Reset ${meta.label} configuration`,
    })
    toast.success(`${meta.label} ${t('configurationReset')}`)
  }

  const handleDelete = () => {
    deleteConnector(type)
    addAuditLog({
      tenantId: activeTenantId,
      actor: `${role.toLowerCase()}@aura.io`,
      role,
      action: 'delete',
      connectorType: type,
      details: `Deleted ${meta.label}`,
    })
    toast.success(`${meta.label} ${t('deleted')}`)
    router.push('/connectors')
  }

  const handleCopyJson = async () => {
    await copyToClipboard(JSON.stringify(connector.config, null, 2))
    toast.success(t('jsonCopied'))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/connectors')}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          {t('backToConnectors')}
        </Button>
        <div className="flex items-center gap-3">
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
            <Icon className="text-muted-foreground h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{connector.name}</h1>
            <p className="text-muted-foreground text-sm">{meta.description}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('configuration')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ConnectorForm key={connector.updatedAt} type={type} connector={connector} />
            </CardContent>
          </Card>

          {type === 'bedrock' && <AIGovernancePanel />}
          <AuditLogViewer />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{t('status')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <StatusBadge status={connector.status} />
              {connector.lastTestAt && (
                <p className="text-muted-foreground text-xs">
                  {t('lastTested')}: {formatTimestamp(connector.lastTestAt)}
                </p>
              )}
              {connector.lastTestOk !== null && (
                <p
                  className={`text-xs ${connector.lastTestOk ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}
                >
                  {t('result')}: {connector.lastTestOk ? t('success') : t('failed')}
                </p>
              )}
            </CardContent>
          </Card>

          <SecurityIndicators type={type} />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{t('actions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full justify-start"
                variant="outline"
                size="sm"
                onClick={handleTest}
                disabled={testing}
              >
                <Play className="mr-2 h-3.5 w-3.5" />
                {t('testConnection')}
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                size="sm"
                onClick={handleCopyJson}
              >
                <Copy className="mr-2 h-3.5 w-3.5" />
                {t('copyJsonConfig')}
              </Button>
              {isEditor && (
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                >
                  <RotateCcw className="mr-2 h-3.5 w-3.5" />
                  {t('resetConfiguration')}
                </Button>
              )}
              {isAdmin && (
                <Button
                  className="w-full justify-start"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  {t('deleteConnector')}
                </Button>
              )}
            </CardContent>
          </Card>

          <TestLogs logs={connector.lastLogs} lastError={connector.lastError} />
        </div>
      </div>
    </div>
  )
}
