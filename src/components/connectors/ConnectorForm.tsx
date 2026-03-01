'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'
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
import type { ConnectorType, ConnectorRecord } from '@/lib/types/connectors'
import { CONNECTOR_META, BEDROCK_MODELS, AWS_REGIONS, canEdit } from '@/lib/types/connectors'
import { getConnectorSchema, type ConnectorFormValues } from '@/lib/validation/connectors.schema'
import { useConnectorsStore } from '@/stores/connectors.store'

function recordToFormValues(record: ConnectorRecord): ConnectorFormValues {
  const c = record.config
  return {
    name: record.name,
    enabled: record.enabled,
    baseUrl: String(c['baseUrl'] ?? ''),
    authType: (['apiKey', 'basic', 'bearer', 'iam'].includes(String(c['authType'] ?? ''))
      ? String(c['authType'])
      : 'apiKey') as 'apiKey' | 'basic' | 'bearer' | 'iam',
    apiKey: String(c['apiKey'] ?? ''),
    username: String(c['username'] ?? ''),
    password: String(c['password'] ?? ''),
    token: String(c['token'] ?? ''),
    verifyTLS: c['verifyTLS'] !== false,
    timeoutSeconds: Number(c['timeoutSeconds'] ?? 30) || 30,
    tags: Array.isArray(c['tags']) ? (c['tags'] as string[]).join(', ') : '',
    notes: String(c['notes'] ?? ''),
    managerUrl: String(c['managerUrl'] ?? ''),
    indexerUrl: String(c['indexerUrl'] ?? ''),
    indexerUsername: String(c['indexerUsername'] ?? ''),
    indexerPassword: String(c['indexerPassword'] ?? ''),
    tenant: String(c['tenant'] ?? ''),
    apiUrl: String(c['apiUrl'] ?? ''),
    streamId: String(c['streamId'] ?? ''),
    indexSetId: String(c['indexSetId'] ?? ''),
    orgId: String(c['orgId'] ?? ''),
    clientCert: String(c['clientCert'] ?? ''),
    clientKey: String(c['clientKey'] ?? ''),
    grafanaUrl: String(c['grafanaUrl'] ?? ''),
    folderId: String(c['folderId'] ?? ''),
    datasourceUid: String(c['datasourceUid'] ?? ''),
    org: String(c['org'] ?? ''),
    bucket: String(c['bucket'] ?? ''),
    mispUrl: String(c['mispUrl'] ?? ''),
    mispAuthKey: String(c['mispAuthKey'] ?? ''),
    webhookUrl: String(c['webhookUrl'] ?? ''),
    workflowId: String(c['workflowId'] ?? ''),
    shuffleApiKey: String(c['shuffleApiKey'] ?? ''),
    modelId: String(c['modelId'] ?? ''),
    region: String(c['region'] ?? ''),
    accessKeyId: String(c['accessKeyId'] ?? ''),
    secretAccessKey: String(c['secretAccessKey'] ?? ''),
    nlHuntingEnabled: c['nlHuntingEnabled'] === true,
    explainableAiEnabled: c['explainableAiEnabled'] === true,
    auditLoggingEnabled: c['auditLoggingEnabled'] === true,
  }
}

interface ConnectorFormProps {
  type: ConnectorType
  connector: ConnectorRecord
  readOnly?: boolean
}

export function ConnectorForm({ type, connector, readOnly }: ConnectorFormProps) {
  const t = useTranslations('connectors')
  const upsert = useConnectorsStore(s => s.upsert)
  const role = useConnectorsStore(s => s.role)
  const addAuditLog = useConnectorsStore(s => s.addAuditLog)
  const activeTenantId = useConnectorsStore(s => s.activeTenantId)
  const meta = CONNECTOR_META[type]

  const disabled = readOnly || !canEdit(role)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<ConnectorFormValues>({
    resolver: zodResolver(getConnectorSchema(type)),
    defaultValues: recordToFormValues(connector),
  })

  const authType = watch('authType')

  const onSubmit = (values: ConnectorFormValues) => {
    const { name, enabled, tags, ...configFields } = values
    upsert(type, {
      name,
      enabled,
      config: {
        ...configFields,
        tags: tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
      },
    })
    addAuditLog({
      tenantId: activeTenantId,
      actor: `${role.toLowerCase()}@aura.io`,
      role,
      action: 'update',
      connectorType: type,
      details: `Updated ${meta.label} configuration`,
    })
    toast.success(`${meta.label} ${t('configurationSaved')}`)
  }

  function FieldError({ name }: { name: keyof ConnectorFormValues }) {
    const error = errors[name]
    if (!error?.message) return null
    return <p className="text-destructive text-sm">{String(error.message)}</p>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
          {t('general')}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input id="name" disabled={disabled} {...register('name')} />
            <FieldError name="name" />
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

      {type !== 'bedrock' && (
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
                <FieldError name="baseUrl" />
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
                          <SelectItem value="apiKey">{t('apiKeyAuth')}</SelectItem>
                          <SelectItem value="basic">{t('basicAuth')}</SelectItem>
                          <SelectItem value="bearer">{t('bearerToken')}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {authType === 'apiKey' && (
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">{t('apiKeyAuth')}</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      disabled={disabled}
                      {...register('apiKey')}
                    />
                    <FieldError name="apiKey" />
                  </div>
                )}

                {authType === 'basic' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="username">{t('username')}</Label>
                      <Input id="username" disabled={disabled} {...register('username')} />
                      <FieldError name="username" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="password">{t('password')}</Label>
                      <Input
                        id="password"
                        type="password"
                        disabled={disabled}
                        {...register('password')}
                      />
                      <FieldError name="password" />
                    </div>
                  </>
                )}

                {authType === 'bearer' && (
                  <div className="space-y-2">
                    <Label htmlFor="token">{t('token')}</Label>
                    <Input id="token" type="password" disabled={disabled} {...register('token')} />
                    <FieldError name="token" />
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
                <FieldError name="timeoutSeconds" />
              </div>
            </div>
          </div>

          <Separator />
        </>
      )}

      {type === 'wazuh' && (
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
                <FieldError name="indexerUrl" />
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
                <Input
                  id="indexerPassword"
                  type="password"
                  disabled={disabled}
                  {...register('indexerPassword')}
                />
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

      {type === 'graylog' && (
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
                <FieldError name="apiUrl" />
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

      {type === 'velociraptor' && (
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
                <FieldError name="apiUrl" />
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

      {type === 'grafana' && (
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
                <FieldError name="grafanaUrl" />
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

      {type === 'influxdb' && (
        <>
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              InfluxDB
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="org">{t('influxdb.organization')}</Label>
                <Input id="org" disabled={disabled} {...register('org')} />
                <FieldError name="org" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bucket">{t('influxdb.bucket')}</Label>
                <Input id="bucket" disabled={disabled} {...register('bucket')} />
                <FieldError name="bucket" />
              </div>
            </div>
            <p className="text-muted-foreground text-xs">{t('influxdb.tokenNote')}</p>
          </div>
          <Separator />
        </>
      )}

      {type === 'misp' && (
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
                <FieldError name="mispUrl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mispAuthKey">{t('mispConfig.authKey')}</Label>
                <Input
                  id="mispAuthKey"
                  type="password"
                  disabled={disabled}
                  {...register('mispAuthKey')}
                />
                <FieldError name="mispAuthKey" />
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {type === 'shuffle' && (
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
                <FieldError name="webhookUrl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workflowId">{t('shuffleConfig.workflowId')}</Label>
                <Input id="workflowId" disabled={disabled} {...register('workflowId')} />
                <FieldError name="workflowId" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shuffleApiKey">{t('shuffleConfig.apiKey')}</Label>
                <Input
                  id="shuffleApiKey"
                  type="password"
                  disabled={disabled}
                  {...register('shuffleApiKey')}
                />
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {type === 'bedrock' && (
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
                <FieldError name="modelId" />
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
                <FieldError name="region" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accessKeyId">{t('accessKeyId')}</Label>
                <Input id="accessKeyId" disabled={disabled} {...register('accessKeyId')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secretAccessKey">{t('secretAccessKey')}</Label>
                <Input
                  id="secretAccessKey"
                  type="password"
                  disabled={disabled}
                  {...register('secretAccessKey')}
                />
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
          <Button type="submit" disabled={!isDirty}>
            {t('saveConfiguration')}
          </Button>
        </div>
      )}
    </form>
  )
}
