import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { AiAgentTier } from '@/enums'
import { createAiAgentSchema } from '@/lib/validation/ai-agents.schema'
import type { AiAgentCreateDialogProps, CreateAiAgentFormValues } from '@/types'

export function useAiAgentCreateDialog({
  open,
  onOpenChange,
  onSubmit,
}: Pick<AiAgentCreateDialogProps, 'open' | 'onOpenChange' | 'onSubmit'>) {
  const t = useTranslations('aiAgents')

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateAiAgentFormValues>({
    resolver: zodResolver(createAiAgentSchema),
    defaultValues: {
      name: '',
      description: '',
      model: '',
      tier: AiAgentTier.L1,
      soulMd: '',
    },
  })

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const handleFormSubmit = (data: CreateAiAgentFormValues) => {
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
