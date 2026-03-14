'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { EditCycleDialogProps, EditCycleFormValues } from '@/types'

export function EditCycleDialog({
  open,
  onOpenChange,
  onSubmit,
  loading,
  cycle,
}: EditCycleDialogProps) {
  const t = useTranslations('cases.cycles')

  const { register, handleSubmit, reset, formState } = useForm<EditCycleFormValues>({
    defaultValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
    },
  })

  // Reset form when dialog opens (populate) or closes (covers programmatic close on success)
  useEffect(() => {
    if (cycle && open) {
      reset({
        name: cycle.name,
        description: cycle.description ?? '',
        startDate: cycle.startDate.split('T')[0] ?? '',
        endDate: cycle.endDate?.split('T')[0] ?? '',
      })
    } else if (!open) {
      reset()
    }
  }, [cycle, open, reset])

  const handleFormSubmit = (data: EditCycleFormValues) => {
    onSubmit(data)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset()
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('editCycle')}</DialogTitle>
          <DialogDescription>{t('editCycleDescription')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-cycle-name">{t('name')}</Label>
            <Input
              id="edit-cycle-name"
              {...register('name', { required: true })}
              placeholder={t('namePlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-cycle-description">{t('description')}</Label>
            <Textarea
              id="edit-cycle-description"
              {...register('description')}
              placeholder={t('descriptionPlaceholder')}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-cycle-start">{t('startDate')}</Label>
              <Input
                id="edit-cycle-start"
                type="date"
                {...register('startDate', { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-cycle-end">{t('endDate')}</Label>
              <Input id="edit-cycle-end" type="date" {...register('endDate')} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={loading ?? !formState.isValid}>
              {loading ? t('saving') : t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
