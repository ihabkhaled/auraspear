import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { editHealthCheckSchema } from '@/lib/validation/system-health.schema'
import type { SystemHealthEditDialogProps, EditHealthCheckFormValues } from '@/types'

export function useSystemHealthEditDialog({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
}: Pick<SystemHealthEditDialogProps, 'open' | 'onOpenChange' | 'onSubmit' | 'initialValues'>) {
  const t = useTranslations('systemHealth')

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EditHealthCheckFormValues>({
    resolver: zodResolver(editHealthCheckSchema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    if (open) {
      reset(initialValues)
    }
  }, [open, initialValues, reset])

  const handleFormSubmit = (data: EditHealthCheckFormValues) => {
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
    control,
    errors,
    handleFormSubmit,
    handleOpenChange,
  }
}
