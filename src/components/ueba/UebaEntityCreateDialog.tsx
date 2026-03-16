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
import { UebaEntityType } from '@/enums'
import { useUebaEntityCreateDialog } from '@/hooks/useUebaEntityCreateDialog'
import { UEBA_ENTITY_TYPE_LABEL_KEYS } from '@/lib/constants/ueba'
import { lookup } from '@/lib/utils'
import type { UebaEntityCreateDialogProps } from '@/types'

export function UebaEntityCreateDialog({
  open,
  onOpenChange,
  onSubmit,
  loading = false,
}: UebaEntityCreateDialogProps) {
  const { t, register, handleSubmit, control, errors, handleFormSubmit, handleOpenChange } =
    useUebaEntityCreateDialog({ open, onOpenChange, onSubmit })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('createEntity')}</DialogTitle>
          <DialogDescription>{t('createEntityDescription')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="entity-name">{t('fieldEntityName')}</Label>
            <Input
              id="entity-name"
              {...register('entityName')}
              placeholder={t('fieldEntityNamePlaceholder')}
              aria-invalid={errors.entityName ? true : undefined}
            />
            {errors.entityName && (
              <p className="text-destructive text-xs">{t('validationEntityNameMin')}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t('fieldEntityType')}</Label>
            <Controller
              name="entityType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('fieldEntityTypePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(UebaEntityType).map(type => (
                      <SelectItem key={type} value={type}>
                        {t(lookup(UEBA_ENTITY_TYPE_LABEL_KEYS, type))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.entityType && (
              <p className="text-destructive text-xs">{t('validationEntityType')}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="entity-department">{t('fieldDepartment')}</Label>
            <Input
              id="entity-department"
              {...register('department')}
              placeholder={t('fieldDepartmentPlaceholder')}
            />
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
