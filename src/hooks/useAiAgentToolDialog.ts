import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { aiAgentToolSchema } from '@/lib/validation/ai-agents.schema'
import type { AiAgentToolFormValues } from '@/types'

const DEFAULT_VALUES: AiAgentToolFormValues = {
  name: '',
  description: '',
  schema: '{\n  \n}',
}

interface UseAiAgentToolDialogParams {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: AiAgentToolFormValues) => void
  initialValues: AiAgentToolFormValues | undefined
}

export function useAiAgentToolDialog({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
}: UseAiAgentToolDialogParams) {
  const t = useTranslations('aiAgents')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AiAgentToolFormValues>({
    resolver: zodResolver(aiAgentToolSchema),
    defaultValues: initialValues ?? DEFAULT_VALUES,
  })

  useEffect(() => {
    if (open) {
      reset(initialValues ?? DEFAULT_VALUES)
    } else {
      reset(DEFAULT_VALUES)
    }
  }, [open, initialValues, reset])

  const isEditing = initialValues !== undefined

  const handleFormSubmit = (data: AiAgentToolFormValues) => {
    onSubmit(data)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset(DEFAULT_VALUES)
    }
    onOpenChange(nextOpen)
  }

  return {
    t,
    register,
    handleSubmit,
    errors,
    isEditing,
    handleFormSubmit,
    handleOpenChange,
  }
}
