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

interface CreateCycleFormValues {
  name: string
  description: string
  startDate: string
  endDate: string
}

interface CreateCycleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateCycleFormValues) => void
  loading?: boolean
}

export type { CreateCycleFormValues }

export function CreateCycleDialog({
  open,
  onOpenChange,
  onSubmit,
  loading,
}: CreateCycleDialogProps) {
  const t = useTranslations('cases.cycles')

  const { register, handleSubmit, reset, formState } = useForm<CreateCycleFormValues>({
    defaultValues: {
      name: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0] ?? '',
      endDate: '',
    },
  })

  // Reset form when dialog closes (covers programmatic close on success)
  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const handleFormSubmit = (data: CreateCycleFormValues) => {
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
          <DialogTitle>{t('createCycle')}</DialogTitle>
          <DialogDescription>{t('createCycleDescription')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cycle-name">{t('name')}</Label>
            <Input
              id="cycle-name"
              {...register('name', { required: true })}
              placeholder={t('namePlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cycle-description">{t('description')}</Label>
            <Textarea
              id="cycle-description"
              {...register('description')}
              placeholder={t('descriptionPlaceholder')}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cycle-start">{t('startDate')}</Label>
              <Input id="cycle-start" type="date" {...register('startDate', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cycle-end">{t('endDate')}</Label>
              <Input id="cycle-end" type="date" {...register('endDate')} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={loading ?? !formState.isValid}>
              {loading ? t('creating') : t('create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
