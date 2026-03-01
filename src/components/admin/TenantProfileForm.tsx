'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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
import { TenantEnvironment } from '@/enums'

const tenantProfileSchema = z.object({
  name: z.string().min(2).max(100),
  environment: z.nativeEnum(TenantEnvironment),
  settings: z.string().optional(),
})

type TenantProfileFormValues = z.infer<typeof tenantProfileSchema>

interface TenantProfileFormProps {
  defaultValues?: Partial<TenantProfileFormValues>
  onSubmit: (values: TenantProfileFormValues) => void
  onCancel: () => void
  loading?: boolean
}

export function TenantProfileForm({
  defaultValues,
  onSubmit,
  onCancel,
  loading = false,
}: TenantProfileFormProps) {
  const t = useTranslations('admin')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TenantProfileFormValues>({
    resolver: zodResolver(tenantProfileSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      environment: defaultValues?.environment ?? TenantEnvironment.PRODUCTION,
      settings: defaultValues?.settings ?? '',
    },
  })

  const currentEnvironment = watch('environment')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="tenant-name">{t('tenant.name')}</Label>
        <Input id="tenant-name" {...register('name')} placeholder={t('tenant.namePlaceholder')} />
        {errors.name && <p className="text-destructive text-sm">{t('tenant.nameRequired')}</p>}
      </div>

      <div className="space-y-2">
        <Label>{t('tenant.environment')}</Label>
        <Select
          value={currentEnvironment}
          onValueChange={val => setValue('environment', val as TenantEnvironment)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('tenant.selectEnvironment')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TenantEnvironment.PRODUCTION}>
              {t('tenant.envProduction')}
            </SelectItem>
            <SelectItem value={TenantEnvironment.STAGING}>{t('tenant.envStaging')}</SelectItem>
            <SelectItem value={TenantEnvironment.DEVELOPMENT}>
              {t('tenant.envDevelopment')}
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.environment && (
          <p className="text-destructive text-sm">{t('tenant.environmentRequired')}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tenant-settings">{t('tenant.settings')}</Label>
        <Input
          id="tenant-settings"
          {...register('settings')}
          placeholder={t('tenant.settingsPlaceholder')}
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? t('common.saving') : t('common.save')}
        </Button>
      </div>
    </form>
  )
}
