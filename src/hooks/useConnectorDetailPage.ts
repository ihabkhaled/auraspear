import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Toast, SweetAlertDialog, SweetAlertIcon } from '@/components/common'
import { ConnectorStatus, type ConnectorType, Permission } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import {
  isConnectorType,
  CONNECTOR_ICONS,
  CONNECTOR_META,
} from '@/lib/constants/connectors.constants'
import { hasPermission } from '@/lib/permissions'
import { lookup } from '@/lib/utils'
import { useAuthStore } from '@/stores'
import {
  useConnector,
  useTestConnector,
  useDeleteConnector,
  useCreateConnector,
} from './useConnectors'

export function useConnectorDetailPage(rawType: string) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('connectors')
  const tErrors = useTranslations('errors')
  const [testing, setTesting] = useState(false)

  const isCreateMode = searchParams.get('create') === 'true'

  const permissions = useAuthStore(s => s.permissions)
  const isEditor = hasPermission(permissions, Permission.CONNECTORS_UPDATE)
  const isAdmin = hasPermission(permissions, Permission.CONNECTORS_DELETE)

  const { data: connector, isLoading } = useConnector(rawType, !isCreateMode)
  const testMutation = useTestConnector()
  const deleteMutation = useDeleteConnector()
  const createMutation = useCreateConnector()

  const isValidType = isConnectorType(rawType)
  const validType = isValidType ? (rawType as ConnectorType) : undefined
  const meta = validType ? lookup(CONNECTOR_META, validType) : undefined
  const Icon = validType ? lookup(CONNECTOR_ICONS, validType) : undefined

  const handleTest = () => {
    if (!isValidType || !meta) return
    setTesting(true)
    Toast.info(t('testingConnector', { name: meta.label }))
    testMutation.mutate(rawType, {
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
      onSettled: () => {
        setTesting(false)
      },
    })
  }

  const handleDelete = async () => {
    if (!isValidType || !meta) return
    const confirmed = await SweetAlertDialog.show({
      text: t('confirmDelete'),
      icon: SweetAlertIcon.QUESTION,
    })
    if (!confirmed) return

    deleteMutation.mutate(rawType, {
      onSuccess: () => {
        Toast.success(`${meta.label} ${t('deleted')}`)
        router.push('/connectors')
      },
      onError: (error: unknown) => {
        Toast.error(tErrors(getErrorKey(error)))
      },
    })
  }

  const handleCreate = (data: {
    type: string
    name: string
    enabled: boolean
    authType: string
    config: Record<string, unknown>
  }) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        Toast.success(t('connectorCreated'))
        router.push('/connectors')
      },
      onError: (error: unknown) => {
        Toast.error(tErrors(getErrorKey(error)))
      },
    })
  }

  let connectorStatus: ConnectorStatus | undefined
  if (connector) {
    if (connector.lastTestOk === true) {
      connectorStatus = ConnectorStatus.CONNECTED
    } else if (connector.lastTestOk === false) {
      connectorStatus = ConnectorStatus.DISCONNECTED
    } else {
      connectorStatus = ConnectorStatus.NOT_CONFIGURED
    }
  }

  return {
    router,
    t,
    isValidType,
    isLoading: isCreateMode ? false : isLoading,
    connector,
    type: validType,
    meta,
    Icon,
    isEditor,
    isAdmin,
    testing,
    deletePending: deleteMutation.isPending,
    createPending: createMutation.isPending,
    connectorStatus,
    isCreateMode,
    handleTest,
    handleDelete,
    handleCreate,
  }
}
