import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import type { CreateCycleDialogProps, CreateCycleFormValues } from '@/types'

export function useCreateCycleDialog({
  open,
  onOpenChange,
  onSubmit,
}: Pick<CreateCycleDialogProps, 'open' | 'onOpenChange' | 'onSubmit'>) {
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

  return {
    t,
    register,
    handleSubmit,
    formState,
    handleFormSubmit,
    handleOpenChange,
  }
}
