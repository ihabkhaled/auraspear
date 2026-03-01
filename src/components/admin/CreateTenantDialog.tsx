'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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

const createTenantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  environment: z.nativeEnum(TenantEnvironment),
})

type CreateTenantFormValues = z.infer<typeof createTenantSchema>

export type { CreateTenantFormValues }

interface CreateTenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: CreateTenantFormValues) => void
  loading: boolean
}

export function CreateTenantDialog({
  open,
  onOpenChange,
  onSubmit,
  loading,
}: CreateTenantDialogProps) {
  const t = useTranslations('admin')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateTenantFormValues>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: {
      name: '',
      environment: TenantEnvironment.PRODUCTION,
    },
  })

  const currentEnvironment = watch('environment')

  function handleFormSubmit(values: CreateTenantFormValues) {
    onSubmit(values)
    reset()
  }

  function handleOpenChange(value: boolean) {
    if (!value) {
      reset()
    }
    onOpenChange(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('tenants.addTenant')}</DialogTitle>
          <DialogDescription>{t('tenants.addTenantDescription')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tenant-name">{t('tenants.tenantName')}</Label>
            <Input
              id="tenant-name"
              {...register('name')}
              placeholder={t('tenants.tenantNamePlaceholder')}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t('tenants.environment')}</Label>
            <Select
              value={currentEnvironment}
              onValueChange={val => setValue('environment', val as TenantEnvironment)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TenantEnvironment.PRODUCTION}>
                  {t('tenants.envProduction')}
                </SelectItem>
                <SelectItem value={TenantEnvironment.STAGING}>{t('tenants.envStaging')}</SelectItem>
                <SelectItem value={TenantEnvironment.DEVELOPMENT}>
                  {t('tenants.envDevelopment')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              {t('tenants.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('tenants.creating') : t('tenants.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
