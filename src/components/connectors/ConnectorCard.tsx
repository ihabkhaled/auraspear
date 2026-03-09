'use client'

import { useRouter } from 'next/navigation'
import { Settings, Play, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Toast, SweetAlertDialog, SweetAlertIcon } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { ConnectorStatus, UserRole } from '@/enums'
import { useTestConnector, useToggleConnector, useDeleteConnector } from '@/hooks/useConnectors'
import { getErrorKey } from '@/lib/api-error'
import { CONNECTOR_ICONS, CONNECTOR_META } from '@/lib/constants/connectors.constants'
import { hasRole } from '@/lib/roles'
import type { ConnectorRecord } from '@/lib/types/connectors'
import { formatRelativeTime } from '@/lib/utils'
import { useAuthStore } from '@/stores'
import { StatusBadge } from './StatusBadge'

interface ConnectorCardProps {
  connector: ConnectorRecord
}

export function ConnectorCard({ connector }: ConnectorCardProps) {
  const router = useRouter()
  const t = useTranslations('connectors')
  const tErrors = useTranslations()

  const { user } = useAuthStore()
  const userRole = user?.role as UserRole | undefined
  const isEditor = userRole ? hasRole(userRole, UserRole.SOC_ANALYST_L2) : false
  const isAdmin = userRole ? hasRole(userRole, UserRole.TENANT_ADMIN) : false

  const Icon = CONNECTOR_ICONS[connector.type]
  const meta = CONNECTOR_META[connector.type]

  const testMutation = useTestConnector()
  const toggleMutation = useToggleConnector()
  const deleteMutation = useDeleteConnector()

  function deriveStatus(): ConnectorStatus {
    if (connector.lastTestOk === true) return ConnectorStatus.CONNECTED
    if (connector.lastTestOk === false) return ConnectorStatus.DISCONNECTED
    return ConnectorStatus.NOT_CONFIGURED
  }
  const connectorStatus = deriveStatus()

  const handleToggle = (checked: boolean) => {
    toggleMutation.mutate(
      { type: connector.type, enabled: checked },
      {
        onSuccess: () => {
          Toast.success(`${meta.label} ${checked ? t('enabled') : t('disabled')}`)
        },
        onError: (error: unknown) => {
          Toast.error(tErrors(getErrorKey(error)))
        },
      }
    )
  }

  const handleTest = () => {
    Toast.info(t('testingConnector', { name: meta.label }))
    testMutation.mutate(connector.type, {
      onSuccess: result => {
        if (result.ok) {
          Toast.success(`${meta.label} ${t('connectedSuccessfully')}`)
        } else {
          Toast.error(result.details ?? t('connectionFailed'))
        }
      },
      onError: (error: unknown) => {
        Toast.error(tErrors(getErrorKey(error)))
      },
    })
  }

  const handleDelete = async () => {
    const confirmed = await SweetAlertDialog.show({
      text: t('confirmDelete'),
      icon: SweetAlertIcon.QUESTION,
    })
    if (!confirmed) return

    deleteMutation.mutate(connector.type, {
      onSuccess: () => {
        Toast.success(`${meta.label} ${t('deleted')}`)
      },
      onError: (error: unknown) => {
        Toast.error(tErrors(getErrorKey(error)))
      },
    })
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
              <CardDescription>{t(meta.descriptionKey)}</CardDescription>
            </div>
          </div>
          <Switch
            checked={connector.enabled}
            onCheckedChange={handleToggle}
            disabled={!isEditor || toggleMutation.isPending}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <StatusBadge status={connectorStatus} />
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
          {isEditor && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleTest}
              disabled={testMutation.isPending}
            >
              <Play className="mr-1 h-3.5 w-3.5" />
              {t('test')}
            </Button>
          )}
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
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
