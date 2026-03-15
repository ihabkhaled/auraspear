import { z } from 'zod'
import { ComplianceStandard, ComplianceControlStatus } from '@/enums'

export const createComplianceFrameworkSchema = z.object({
  name: z.string().min(3),
  standard: z.nativeEnum(ComplianceStandard),
  description: z.string().min(5),
})

export const editComplianceFrameworkSchema = z.object({
  name: z.string().min(3),
  standard: z.nativeEnum(ComplianceStandard),
  description: z.string().min(5),
})

export const editComplianceControlSchema = z.object({
  status: z.nativeEnum(ComplianceControlStatus),
  evidence: z.string(),
  notes: z.string(),
})
