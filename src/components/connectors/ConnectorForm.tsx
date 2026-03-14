'use client'

import { useState, useCallback } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm, Controller, type UseFormRegister, type FieldErrors } from 'react-hook-form'
import { Toast } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ConnectorAuthType, ConnectorType, UserRole } from '@/enums'
import { useUpdateConnector } from '@/hooks/useConnectors'
import { getErrorKey } from '@/lib/api-error'
import { recordToFormValues } from '@/lib/connector-utils'
import { BEDROCK_MODELS, AWS_REGIONS, CONNECTOR_META } from '@/lib/constants/connectors.constants'
import { hasRole } from '@/lib/roles'
import type { ConnectorRecord } from '@/lib/types/connectors'
import { getConnectorSchema, type ConnectorFormValues } from '@/lib/validation/connectors.schema'
import { useAuthStore } from '@/stores'

interface SecretFieldProps extends Omit<React.ComponentProps<'input'>, 'id'> {
  id: keyof ConnectorFormValues
  fieldDisabled: boolean
  isVisible: boolean
  onToggle: () => void
  isRedacted: boolean
  secretSavedLabel: string
  registerFn: UseFormRegister<ConnectorFormValues>
}

function SecretField({
  id,
  fieldDisabled,
  isVisible,
  onToggle,
  isRedacted,
  secretSavedLabel,
  registerFn,
  ...rest
}: SecretFieldProps) {
  return (
    <div>
      <div className="relative">
        <Input
          id={id}
          type={isVisible ? 'text' : 'password'}
          disabled={fieldDisabled}
          {...registerFn(id)}
          {...rest}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute end-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={onToggle}
          tabIndex={-1}
        >
          {isVisible ? (
            <EyeOff className="text-muted-foreground h-4 w-4" />
          ) : (
            <Eye className="text-muted-foreground h-4 w-4" />
          )}
        </Button>
      </div>
      {isRedacted && <p className="text-muted-foreground mt-1 text-xs">{secretSavedLabel}</p>}
    </div>
  )
}

interface FieldErrorProps {
  name: keyof ConnectorFormValues
  errors: FieldErrors<ConnectorFormValues>
  tValidation: ReturnType<typeof useTranslations>
}

function FieldError({ name, errors, tValidation }: FieldErrorProps) {
  const error = errors[name]
  if (!error?.message) return null
  const msg = String(error.message)
  const translated = tValidation.has(msg) ? tValidation(msg) : msg
  return <p className="text-destructive text-sm">{translated}</p>
}

interface ConnectorFormProps {
  type: ConnectorType
  connector: ConnectorRecord | undefined
  readOnly?: boolean
  onCreateSubmit?: (data: ConnectorFormValues) => void
  createPending?: boolean
}

export function ConnectorForm({
  type,
  connector,
  readOnly,
  onCreateSubmit,
  createPending,
}: ConnectorFormProps) {
  const t = useTranslations('connectors')
  const tErrors = useTranslations()
  const { user } = useAuthStore()
  const userRole = user?.role as UserRole | undefined
  const meta = CONNECTOR_META[type]
  const updateMutation = useUpdateConnector(type)

  const disabled = readOnly ?? !(userRole ? hasRole(userRole, UserRole.SOC_ANALYST_L2) : false)

  const tValidation = useTranslations('validation')

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

    const { name, enabled, authType, tags, ...configFields } = values

    // Normalize URL fields to lowercase (user may type Https:// or HTTP://)
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

    // Strip out REDACTED values — backend preserves existing secrets for missing keys
    const cleanedConfig: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(normalizedConfig)) {
      if (val !== '***REDACTED***') {
        cleanedConfig[key] = val
      }
    }

    const config = {
      ...cleanedConfig,
      authType,
      tags: tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean),
    }

    updateMutation.mutate(
      { name, enabled, authType, config },
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

  const renderSecret = (id: keyof ConnectorFormValues) => (
    <SecretField
      id={id}
      fieldDisabled={disabled}
      isVisible={visibleSecrets[id] === true}
      onToggle={() => toggleSecret(id)}
      isRedacted={watch(id) === '***REDACTED***'}
      secretSavedLabel={secretSavedLabel}
      registerFn={register}
    />
  )

  const renderError = (name: keyof ConnectorFormValues) => (
    <FieldError name={name} errors={errors} tValidation={tValidation} />
  )

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
          {t('general')}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input id="name" disabled={disabled} {...register('name')} />
            {renderError('name')}
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Controller
              control={control}
              name="enabled"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                />
              )}
            />
            <Label>{t('enabled')}</Label>
          </div>
        </div>
      </div>

      <Separator />

      {type !== ConnectorType.BEDROCK && (
        <>
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              {t('connection')}
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="baseUrl">{t('baseUrl')}</Label>
                <Input
                  id="baseUrl"
                  placeholder={t('urlPlaceholder')}
                  disabled={disabled}
                  {...register('baseUrl')}
                />
                {renderError('baseUrl')}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t('authType')}</Label>
                  <Controller
                    control={control}
                    name="authType"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={disabled}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ConnectorAuthType.API_KEY}>
                            {t('apiKeyAuth')}
                          </SelectItem>
                          <SelectItem value={ConnectorAuthType.BASIC}>{t('basicAuth')}</SelectItem>
                          <SelectItem value={ConnectorAuthType.TOKEN}>
                            {t('bearerToken')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {authType === ConnectorAuthType.API_KEY && (
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">{t('apiKeyAuth')}</Label>
                    {renderSecret('apiKey')}
                    {renderError('apiKey')}
                  </div>
                )}

                {authType === ConnectorAuthType.BASIC && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="username">{t('username')}</Label>
                      <Input id="username" disabled={disabled} {...register('username')} />
                      {renderError('username')}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="password">{t('password')}</Label>
                      {renderSecret('password')}
                      {renderError('password')}
                    </div>
                  </>
                )}

                {authType === ConnectorAuthType.TOKEN && (
                  <div className="space-y-2">
                    <Label htmlFor="token">{t('token')}</Label>
                    {renderSecret('token')}
                    {renderError('token')}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              {t('advanced')}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Controller
                  control={control}
                  name="verifyTLS"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={disabled}
                    />
                  )}
                />
                <Label>{t('verifyTLS')}</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeoutSeconds">{t('timeout')}</Label>
                <Input
                  id="timeoutSeconds"
                  type="number"
                  min={1}
                  max={120}
                  disabled={disabled}
                  {...register('timeoutSeconds', { valueAsNumber: true })}
                />
                {renderError('timeoutSeconds')}
              </div>
            </div>
          </div>

          <Separator />
        </>
      )}

      {type === ConnectorType.WAZUH && (
        <>
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Wazuh
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="indexerUrl">{t('wazuh.indexerUrl')}</Label>
                <Input
                  id="indexerUrl"
                  placeholder={t('urlPlaceholder')}
                  disabled={disabled}
                  {...register('indexerUrl')}
                />
                {renderError('indexerUrl')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="managerUrl">{t('wazuh.managerUrl')}</Label>
                <Input
                  id="managerUrl"
                  placeholder={t('urlPlaceholder')}
                  disabled={disabled}
                  {...register('managerUrl')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="indexerUsername">{t('wazuh.indexerUsername')}</Label>
                <Input id="indexerUsername" disabled={disabled} {...register('indexerUsername')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="indexerPassword">{t('wazuh.indexerPassword')}</Label>
                {renderSecret('indexerPassword')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenant">{t('wazuh.tenant')}</Label>
                <Input id="tenant" disabled={disabled} {...register('tenant')} />
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {type === ConnectorType.GRAYLOG && (
        <>
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Graylog
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="apiUrl">{t('graylog.apiUrl')}</Label>
                <Input
                  id="apiUrl"
                  placeholder={t('urlPlaceholder')}
                  disabled={disabled}
                  {...register('apiUrl')}
                />
                {renderError('apiUrl')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="streamId">{t('graylog.streamId')}</Label>
                <Input id="streamId" disabled={disabled} {...register('streamId')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="indexSetId">{t('graylog.indexSetId')}</Label>
                <Input id="indexSetId" disabled={disabled} {...register('indexSetId')} />
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {type === ConnectorType.LOGSTASH && (
        <>
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Logstash
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pipelineId">{t('logstash.pipelineId')}</Label>
                <Input id="pipelineId" disabled={disabled} {...register('pipelineId')} />
              </div>
            </div>
            <p className="text-muted-foreground text-xs">{t('logstash.apiNote')}</p>
          </div>
          <Separator />
        </>
      )}

      {type === ConnectorType.VELOCIRAPTOR && (
        <>
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Velociraptor
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="apiUrl">{t('velociraptor.apiUrl')}</Label>
                <Input
                  id="apiUrl"
                  placeholder={t('urlPlaceholder')}
                  disabled={disabled}
                  {...register('apiUrl')}
                />
                {renderError('apiUrl')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgId">{t('velociraptor.orgId')}</Label>
                <Input id="orgId" disabled={disabled} {...register('orgId')} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="clientCert">{t('velociraptor.clientCert')}</Label>
                <Textarea
                  id="clientCert"
                  rows={3}
                  disabled={disabled}
                  {...register('clientCert')}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="clientKey">{t('velociraptor.clientKey')}</Label>
                <Textarea id="clientKey" rows={3} disabled={disabled} {...register('clientKey')} />
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {type === ConnectorType.GRAFANA && (
        <>
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Grafana
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="grafanaUrl">{t('grafana.url')}</Label>
                <Input
                  id="grafanaUrl"
                  placeholder={t('urlPlaceholder')}
                  disabled={disabled}
                  {...register('grafanaUrl')}
                />
                {renderError('grafanaUrl')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="folderId">{t('grafana.folderId')}</Label>
                <Input id="folderId" disabled={disabled} {...register('folderId')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="datasourceUid">{t('grafana.datasourceUid')}</Label>
                <Input id="datasourceUid" disabled={disabled} {...register('datasourceUid')} />
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {type === ConnectorType.INFLUXDB && (
        <>
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              InfluxDB
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="org">{t('influxdb.organization')}</Label>
                <Input id="org" disabled={disabled} {...register('org')} />
                {renderError('org')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bucket">{t('influxdb.bucket')}</Label>
                <Input id="bucket" disabled={disabled} {...register('bucket')} />
                {renderError('bucket')}
              </div>
            </div>
            <p className="text-muted-foreground text-xs">{t('influxdb.tokenNote')}</p>
          </div>
          <Separator />
        </>
      )}

      {type === ConnectorType.MISP && (
        <>
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              MISP
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="mispUrl">{t('mispConfig.url')}</Label>
                <Input
                  id="mispUrl"
                  placeholder={t('mispConfig.urlPlaceholder')}
                  disabled={disabled}
                  {...register('mispUrl')}
                />
                {renderError('mispUrl')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mispAuthKey">{t('mispConfig.authKey')}</Label>
                {renderSecret('mispAuthKey')}
                {renderError('mispAuthKey')}
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {type === ConnectorType.SHUFFLE && (
        <>
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Shuffle SOAR
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">{t('shuffleConfig.webhookUrl')}</Label>
                <Input
                  id="webhookUrl"
                  placeholder={t('urlPlaceholder')}
                  disabled={disabled}
                  {...register('webhookUrl')}
                />
                {renderError('webhookUrl')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="workflowId">{t('shuffleConfig.workflowId')}</Label>
                <Input id="workflowId" disabled={disabled} {...register('workflowId')} />
                {renderError('workflowId')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="shuffleApiKey">{t('shuffleConfig.apiKey')}</Label>
                {renderSecret('shuffleApiKey')}
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {type === ConnectorType.BEDROCK && (
        <>
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              AWS Bedrock AI
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('model')}</Label>
                <Controller
                  control={control}
                  name="modelId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('selectModel')} />
                      </SelectTrigger>
                      <SelectContent>
                        {BEDROCK_MODELS.map(m => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {renderError('modelId')}
              </div>
              <div className="space-y-2">
                <Label>{t('region')}</Label>
                <Controller
                  control={control}
                  name="region"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('selectRegion')} />
                      </SelectTrigger>
                      <SelectContent>
                        {AWS_REGIONS.map(r => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {renderError('region')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="accessKeyId">{t('accessKeyId')}</Label>
                <Input id="accessKeyId" disabled={disabled} {...register('accessKeyId')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secretAccessKey">{t('secretAccessKey')}</Label>
                {renderSecret('secretAccessKey')}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="endpoint">{t('endpoint')}</Label>
                <Input
                  id="endpoint"
                  disabled={disabled}
                  placeholder={t('endpointPlaceholder')}
                  {...register('endpoint')}
                />
                <p className="text-muted-foreground text-xs">{t('endpointHint')}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              {t('aiGovernance')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('nlHunting')}</Label>
                  <p className="text-muted-foreground text-xs">{t('nlHuntingDescription')}</p>
                </div>
                <Controller
                  control={control}
                  name="nlHuntingEnabled"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={disabled}
                    />
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('explainableAi')}</Label>
                  <p className="text-muted-foreground text-xs">{t('explainableAiDescription')}</p>
                </div>
                <Controller
                  control={control}
                  name="explainableAiEnabled"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={disabled}
                    />
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('auditLogging')}</Label>
                  <p className="text-muted-foreground text-xs">{t('auditLoggingDescription')}</p>
                </div>
                <Controller
                  control={control}
                  name="auditLoggingEnabled"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={disabled}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <Separator />
        </>
      )}

      <div className="space-y-4">
        <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
          {t('metadata')}
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tags">{t('tags')}</Label>
            <Input
              id="tags"
              placeholder={t('tagPlaceholder')}
              disabled={disabled}
              {...register('tags')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">{t('notes')}</Label>
            <Textarea id="notes" rows={3} disabled={disabled} {...register('notes')} />
          </div>
        </div>
      </div>

      {!disabled && (
        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            disabled={
              onCreateSubmit ? createPending === true : !isDirty || updateMutation.isPending
            }
          >
            {onCreateSubmit && (createPending ? t('saving') : t('createConnector'))}
            {!onCreateSubmit && (updateMutation.isPending ? t('saving') : t('saveConfiguration'))}
          </Button>
        </div>
      )}
    </form>
  )
}
