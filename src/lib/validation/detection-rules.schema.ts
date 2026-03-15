import { z } from 'zod'
import { DetectionRuleSeverity, DetectionRuleStatus, DetectionRuleType } from '@/enums'

export const createDetectionRuleSchema = z.object({
  name: z.string().min(3),
  ruleType: z.nativeEnum(DetectionRuleType),
  severity: z.nativeEnum(DetectionRuleSeverity),
  conditions: z.string().min(2),
  actions: z.string().min(2),
})

export const editDetectionRuleSchema = z.object({
  name: z.string().min(3),
  ruleType: z.nativeEnum(DetectionRuleType),
  severity: z.nativeEnum(DetectionRuleSeverity),
  status: z.nativeEnum(DetectionRuleStatus),
  conditions: z.string().min(2),
  actions: z.string().min(2),
})
