'use client'

import { useRouter } from 'next/navigation'
import {
  Shield,
  FileText,
  Crosshair,
  BarChart3,
  Database,
  Radar,
  Zap,
  Brain,
  Settings,
  Play,
  Trash2,
  type LucideIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { testConnector, deleteConnector } from '@/lib/api/connectors.api'
import type { ConnectorRecord, ConnectorType } from '@/lib/types/connectors'
import { CONNECTOR_META, canEdit, canDelete } from '@/lib/types/connectors'
import { formatRelativeTime } from '@/lib/utils'
import { useConnectorsStore } from '@/stores/connectors.store'
import { StatusBadge } from './StatusBadge'

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

interface ConnectorCardProps {
  connector: ConnectorRecord
}

export function ConnectorCard({ connector }: ConnectorCardProps) {
  const router = useRouter()
  const t = useTranslations('connectors')
  const upsert = useConnectorsStore(s => s.upsert)
  const role = useConnectorsStore(s => s.role)
  const addAuditLog = useConnectorsStore(s => s.addAuditLog)
  const activeTenantId = useConnectorsStore(s => s.activeTenantId)
  const Icon = CONNECTOR_ICONS[connector.type]
  const meta = CONNECTOR_META[connector.type]

  const isEditor = canEdit(role)
  const isAdmin = canDelete(role)

  const handleToggle = (checked: boolean) => {
    upsert(connector.type, { enabled: checked })
    addAuditLog({
      tenantId: activeTenantId,
      actor: `${role.toLowerCase()}@aura.io`,
      role,
      action: checked ? 'enable' : 'disable',
      connectorType: connector.type,
      details: `${checked ? 'Enabled' : 'Disabled'} ${meta.label}`,
    })
    toast.success(`${meta.label} ${checked ? t('enabled') : t('disabled')}`)
  }

  const handleTest = async () => {
    toast.info(t('testingConnector', { name: meta.label }))
    addAuditLog({
      tenantId: activeTenantId,
      actor: `${role.toLowerCase()}@aura.io`,
      role,
      action: 'test',
      connectorType: connector.type,
      details: `Tested ${meta.label}`,
    })
    await testConnector(connector.type)
    const updated = useConnectorsStore.getState().getByType(connector.type)
    if (updated?.lastTestOk) {
      toast.success(`${meta.label} ${t('connectedSuccessfully')}`)
    } else {
      toast.error(updated?.lastError ?? t('connectionFailed'))
    }
  }

  const handleDelete = () => {
    deleteConnector(connector.type)
    addAuditLog({
      tenantId: activeTenantId,
      actor: `${role.toLowerCase()}@aura.io`,
      role,
      action: 'delete',
      connectorType: connector.type,
      details: `Deleted ${meta.label}`,
    })
    toast.success(`${meta.label} ${t('deleted')}`)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
              <Icon className="text-muted-foreground h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">{connector.name}</CardTitle>
              <CardDescription>{meta.description}</CardDescription>
            </div>
          </div>
          <Switch checked={connector.enabled} onCheckedChange={handleToggle} disabled={!isEditor} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <StatusBadge status={connector.status} />
          {connector.lastTestAt && (
            <span className="text-muted-foreground text-xs">
              {t('tested')} {formatRelativeTime(connector.lastTestAt)}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/connectors/${connector.type}`)}
          >
            <Settings className="mr-1 h-3.5 w-3.5" />
            {t('configure')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={connector.status === 'testing'}
          >
            <Play className="mr-1 h-3.5 w-3.5" />
            {t('test')}
          </Button>
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              {t('deleteConnector')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
