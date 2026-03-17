import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Toast, SweetAlertDialog, SweetAlertIcon } from '@/components/common'
import { Permission } from '@/enums'
import { useTestConnector, useToggleConnector, useDeleteConnector } from '@/hooks/useConnectors'
import { getErrorKey } from '@/lib/api-error'
import { CONNECTOR_META } from '@/lib/constants/connectors.constants'
import { hasPermission } from '@/lib/permissions'
import { useAuthStore } from '@/stores'
import type { ConnectorCardProps } from '@/types'

export function useConnectorCard({ connector }: ConnectorCardProps) {
  const router = useRouter()
  const t = useTranslations('connectors')
  const tErrors = useTranslations('errors')

  const permissions = useAuthStore(s => s.permissions)
  const isEditor = hasPermission(permissions, Permission.CONNECTORS_UPDATE)
  const isAdmin = hasPermission(permissions, Permission.CONNECTORS_DELETE)

  const meta = CONNECTOR_META[connector.type]

  const testMutation = useTestConnector()
  const toggleMutation = useToggleConnector()
  const deleteMutation = useDeleteConnector()

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

  return {
    router,
    t,
    isEditor,
    isAdmin,
    meta,
    testMutation,
    toggleMutation,
    deleteMutation,
    handleToggle,
    handleTest,
    handleDelete,
  }
}
