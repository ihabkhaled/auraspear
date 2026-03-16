'use client'

import { Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { Textarea } from '@/components/ui/textarea'
import { ServiceType } from '@/enums'
import { useSystemHealthCreateDialog } from '@/hooks/useSystemHealthCreateDialog'
import { SERVICE_TYPE_LABEL_KEYS } from '@/lib/constants/system-health'
import { lookup } from '@/lib/utils'
import type { SystemHealthCreateDialogProps } from '@/types'

export function SystemHealthCreateDialog({
  open,
  onOpenChange,
  onSubmit,
  loading = false,
}: SystemHealthCreateDialogProps) {
  const { t, register, handleSubmit, control, errors, handleFormSubmit, handleOpenChange } =
    useSystemHealthCreateDialog({ open, onOpenChange, onSubmit })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('createService')}</DialogTitle>
          <DialogDescription>{t('createServiceDescription')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="service-name">{t('fieldServiceName')}</Label>
            <Input
              id="service-name"
              {...register('serviceName')}
              placeholder={t('fieldServiceNamePlaceholder')}
              aria-invalid={errors.serviceName ? true : undefined}
            />
            {errors.serviceName && (
              <p className="text-destructive text-xs">{t('validationServiceName')}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t('fieldServiceType')}</Label>
            <Controller
              name="serviceType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('fieldServiceTypePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ServiceType).map(svc => (
                      <SelectItem key={svc} value={svc}>
                        {t(lookup(SERVICE_TYPE_LABEL_KEYS, svc))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.serviceType && (
              <p className="text-destructive text-xs">{t('validationServiceType')}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="service-config">{t('fieldConfig')}</Label>
            <Textarea
              id="service-config"
              {...register('config')}
              placeholder={t('fieldConfigPlaceholder')}
              aria-invalid={errors.config ? true : undefined}
              className="resize-none font-mono text-sm"
              rows={4}
            />
            {errors.config && <p className="text-destructive text-xs">{t('validationConfig')}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('creating') : t('submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
