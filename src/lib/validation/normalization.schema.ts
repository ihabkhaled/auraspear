import { z } from 'zod'
import { NormalizationSourceType } from '@/enums'

export const createNormalizationSchema = z.object({
  name: z.string().min(3),
  sourceType: z.nativeEnum(NormalizationSourceType),
  parserConfig: z.string().min(2),
  fieldMappings: z.string().min(2),
})

export const editNormalizationSchema = z.object({
  name: z.string().min(3),
  sourceType: z.nativeEnum(NormalizationSourceType),
  parserConfig: z.string().min(2),
  fieldMappings: z.string().min(2),
})
