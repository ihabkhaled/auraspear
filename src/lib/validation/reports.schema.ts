import { z } from 'zod'
import { ReportType, ReportFormat } from '@/enums'

export const createReportSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(5),
  type: z.nativeEnum(ReportType),
  format: z.nativeEnum(ReportFormat),
  scheduled: z.boolean(),
  cronExpression: z.string(),
})

export const editReportSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(5),
  type: z.nativeEnum(ReportType),
  format: z.nativeEnum(ReportFormat),
  scheduled: z.boolean(),
  cronExpression: z.string(),
})
