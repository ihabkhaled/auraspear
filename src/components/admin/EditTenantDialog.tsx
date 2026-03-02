'use client'

import { useEffect } from 'react'
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
import type { Tenant } from '@/types'

const editTenantSchema = z.object({
  name: z.string().min(1).max(255),
})

type EditTenantFormValues = z.infer<typeof editTenantSchema>

export type { EditTenantFormValues }

interface EditTenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant: Tenant | null
  onSubmit: (data: EditTenantFormValues) => void
  loading: boolean
}

export function EditTenantDialog({
  open,
  onOpenChange,
  tenant,
  onSubmit,
  loading,
}: EditTenantDialogProps) {
  const t = useTranslations('admin')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditTenantFormValues>({
    resolver: zodResolver(editTenantSchema),
    defaultValues: {
      name: '',
    },
  })

  useEffect(() => {
    if (tenant) {
      reset({ name: tenant.name })
    }
  }, [tenant, reset])

  function handleFormSubmit(values: EditTenantFormValues) {
    onSubmit(values)
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
          <DialogTitle>{t('tenants.editTenant')}</DialogTitle>
          <DialogDescription>{t('tenants.editTenantDescription')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-tenant-name">{t('tenants.tenantName')}</Label>
            <Input
              id="edit-tenant-name"
              {...register('name')}
              placeholder={t('tenants.tenantNamePlaceholder')}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t('tenants.slug')}</Label>
            <p className="text-muted-foreground font-mono text-sm">{tenant?.slug ?? ''}</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('common.saving') : t('common.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
