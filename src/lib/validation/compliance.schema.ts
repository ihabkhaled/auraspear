import { z } from 'zod'
import { ComplianceStandard, ComplianceControlStatus } from '@/enums'

export const createComplianceFrameworkSchema = z.object({
  name: z.string().min(3),
  standard: z.nativeEnum(ComplianceStandard),
  version: z.string().min(1).max(50),
  description: z.string().min(5),
})

export const editComplianceFrameworkSchema = z.object({
  name: z.string().min(3),
  standard: z.nativeEnum(ComplianceStandard),
  version: z.string().min(1).max(50),
  description: z.string().min(5),
})

export const editComplianceControlSchema = z.object({
  status: z.nativeEnum(ComplianceControlStatus),
  evidence: z.string(),
  notes: z.string(),
})
