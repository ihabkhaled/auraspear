import { z } from 'zod'
import { SoarTriggerType } from '@/enums'

export const createSoarPlaybookSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(5),
  triggerType: z.nativeEnum(SoarTriggerType),
  steps: z.string().min(2),
  cronExpression: z.string(),
})

export const editSoarPlaybookSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(5),
  triggerType: z.nativeEnum(SoarTriggerType),
  steps: z.string().min(2),
  cronExpression: z.string(),
})
