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

const createTenantSchema = z.object({
  name: z.string().min(2).max(255),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[\da-z-]+$/),
})

type CreateTenantFormValues = z.infer<typeof createTenantSchema>

export type { CreateTenantFormValues }

interface CreateTenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: CreateTenantFormValues) => void
  loading: boolean
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z\d\s-]/g, '')
    .replaceAll(/\s+/g, '-')
    .replaceAll(/-+/g, '-')
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
      slug: '',
    },
  })

  const currentSlug = watch('slug')

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nameVal = e.target.value
    setValue('name', nameVal)
    if (!currentSlug || currentSlug === generateSlug(watch('name'))) {
      setValue('slug', generateSlug(nameVal))
    }
  }

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
              onChange={handleNameChange}
              placeholder={t('tenants.tenantNamePlaceholder')}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenant-slug">{t('tenants.slug')}</Label>
            <Input
              id="tenant-slug"
              {...register('slug')}
              placeholder={t('tenants.slugPlaceholder')}
              className="font-mono"
            />
            {errors.slug && <p className="text-destructive text-sm">{errors.slug.message}</p>}
            <p className="text-muted-foreground text-xs">{t('tenants.slugHelp')}</p>
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
