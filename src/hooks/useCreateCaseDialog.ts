import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { CaseSeverity } from '@/enums'
import { createCaseSchema } from '@/lib/validation/cases.schema'
import type { CreateCaseDialogProps, CreateCaseFormValues } from '@/types'

export function useCreateCaseDialog({
  open,
  onOpenChange,
  onSubmit,
}: Pick<CreateCaseDialogProps, 'open' | 'onOpenChange' | 'onSubmit'>) {
  const t = useTranslations('cases')

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateCaseFormValues>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      title: '',
      description: '',
      severity: CaseSeverity.MEDIUM,
    },
  })

  // Reset form when dialog closes (covers programmatic close on success)
  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const handleFormSubmit = (data: CreateCaseFormValues) => {
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
