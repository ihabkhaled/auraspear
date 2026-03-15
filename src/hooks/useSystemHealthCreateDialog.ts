import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { ServiceType } from '@/enums'
import { createHealthCheckSchema } from '@/lib/validation/system-health.schema'
import type { SystemHealthCreateDialogProps, CreateHealthCheckFormValues } from '@/types'

export function useSystemHealthCreateDialog({
  open,
  onOpenChange,
  onSubmit,
}: Pick<SystemHealthCreateDialogProps, 'open' | 'onOpenChange' | 'onSubmit'>) {
  const t = useTranslations('systemHealth')

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateHealthCheckFormValues>({
    resolver: zodResolver(createHealthCheckSchema),
    defaultValues: {
      serviceName: '',
      serviceType: ServiceType.CONNECTOR,
      config: '{}',
    },
  })

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const handleFormSubmit = (data: CreateHealthCheckFormValues) => {
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
