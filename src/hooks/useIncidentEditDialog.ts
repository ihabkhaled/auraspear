import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm, useWatch } from 'react-hook-form'
import { editIncidentSchema } from '@/lib/validation/incidents.schema'
import type { EditIncidentFormValues, IncidentEditDialogProps } from '@/types'

export function useIncidentEditDialog({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
}: Pick<IncidentEditDialogProps, 'open' | 'onOpenChange' | 'onSubmit' | 'initialValues'>) {
  const t = useTranslations('incidents')

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EditIncidentFormValues>({
    resolver: zodResolver(editIncidentSchema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    if (open) {
      reset(initialValues)
    } else {
      reset()
    }
  }, [open, initialValues, reset])

  const handleFormSubmit = (data: EditIncidentFormValues) => {
    onSubmit(data)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset(initialValues)
    }
    onOpenChange(nextOpen)
  }

  const currentStatus = useWatch({ control, name: 'status' })

  return {
    t,
    register,
    handleSubmit,
    control,
    errors,
    handleFormSubmit,
    handleOpenChange,
    currentStatus,
  }
}
