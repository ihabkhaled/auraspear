import { z } from 'zod'
import { UebaEntityType } from '@/enums'

export const createUebaEntitySchema = z.object({
  entityName: z.string().min(2).max(255),
  entityType: z.nativeEnum(UebaEntityType),
  department: z.string().max(255),
})

export const editUebaEntitySchema = z.object({
  entityName: z.string().min(2).max(255),
  entityType: z.nativeEnum(UebaEntityType),
  department: z.string().max(255),
})
