import { useState, useCallback } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { Toast } from '@/components/common'
import { ConnectorAuthType, UserRole } from '@/enums'
import { useUpdateConnector } from '@/hooks/useConnectors'
import { getErrorKey } from '@/lib/api-error'
import { recordToFormValues } from '@/lib/connector-utils'
import { CONNECTOR_META } from '@/lib/constants/connectors.constants'
import { hasRole } from '@/lib/roles'
import { getConnectorSchema, type ConnectorFormValues } from '@/lib/validation/connectors.schema'
import { useAuthStore } from '@/stores'
import type { ConnectorFormProps } from '@/types'

interface UseConnectorFormParams {
  type: ConnectorFormProps['type']
  connector: ConnectorFormProps['connector']
  readOnly: ConnectorFormProps['readOnly'] | undefined
  onCreateSubmit: ConnectorFormProps['onCreateSubmit'] | undefined
}

export function useConnectorForm({
  type,
  connector,
  readOnly,
  onCreateSubmit,
}: UseConnectorFormParams) {
  const t = useTranslations('connectors')
  const tErrors = useTranslations()
  const tValidation = useTranslations('validation')
  const { user } = useAuthStore()
  const userRole = user?.role as UserRole | undefined
  const meta = CONNECTOR_META[type]
  const updateMutation = useUpdateConnector(type)

  const disabled = readOnly ?? !(userRole ? hasRole(userRole, UserRole.SOC_ANALYST_L2) : false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<ConnectorFormValues>({
    resolver: zodResolver(getConnectorSchema(type)),
    defaultValues: connector
      ? recordToFormValues(connector)
      : {
          name: meta.label,
          enabled: false,
          authType: ConnectorAuthType.BASIC,
          baseUrl: '',
          apiKey: '',
          username: '',
          password: '',
          token: '',
          verifyTLS: false,
          timeoutSeconds: 30,
          tags: '',
          notes: '',
          managerUrl: '',
          indexerUrl: '',
          indexerUsername: '',
          indexerPassword: '',
          tenant: '',
          apiUrl: '',
          streamId: '',
          indexSetId: '',
          pipelineId: '',
          orgId: '',
          clientCert: '',
          clientKey: '',
          grafanaUrl: '',
          folderId: '',
          datasourceUid: '',
          org: '',
          bucket: '',
          mispUrl: '',
          mispAuthKey: '',
          webhookUrl: '',
          workflowId: '',
          shuffleApiKey: '',
          modelId: '',
          region: '',
          accessKeyId: '',
          secretAccessKey: '',
          endpoint: '',
          nlHuntingEnabled: false,
          explainableAiEnabled: false,
          auditLoggingEnabled: false,
        },
  })

  const authType = watch('authType')

  const onSubmit = (values: ConnectorFormValues) => {
    if (onCreateSubmit) {
      onCreateSubmit(values)
      return
    }

    const { name, enabled, authType: formAuthType, tags, ...configFields } = values

    const urlKeys = [
      'baseUrl',
      'indexerUrl',
      'managerUrl',
      'apiUrl',
      'grafanaUrl',
      'mispUrl',
      'webhookUrl',
    ] as const
    const normalizedConfig = { ...configFields }
    for (const key of urlKeys) {
      const val = normalizedConfig[key]
      if (val) {
        normalizedConfig[key] = val.toLowerCase()
      }
    }

    const cleanedConfig: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(normalizedConfig)) {
      if (val !== '***REDACTED***') {
        cleanedConfig[key] = val
      }
    }

    const config = {
      ...cleanedConfig,
      authType: formAuthType,
      tags: tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean),
    }

    updateMutation.mutate(
      { name, enabled, authType: formAuthType, config },
      {
        onSuccess: () => {
          Toast.success(`${meta.label} ${t('configurationSaved')}`)
        },
        onError: (error: unknown) => {
          Toast.error(tErrors(getErrorKey(error)))
        },
      }
    )
  }

  const onInvalid = () => {
    Toast.error(tErrors('errors.common.validation'))
  }

  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({})

  const toggleSecret = useCallback((field: string) => {
    setVisibleSecrets(prev => ({ ...prev, [field]: !prev[field] }))
  }, [])

  const secretSavedLabel = t('secretSaved')

  return {
    t,
    tValidation,
    meta,
    disabled,
    register,
    handleSubmit,
    control,
    watch,
    errors,
    isDirty,
    authType,
    onSubmit,
    onInvalid,
    visibleSecrets,
    toggleSecret,
    secretSavedLabel,
    updateMutation,
    type,
    onCreateSubmit,
  }
}
