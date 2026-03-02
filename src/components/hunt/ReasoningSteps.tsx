'use client'

import { CheckCircle2, Loader2, Circle } from 'lucide-react'
import { ReasoningStepStatus } from '@/enums'
import { REASONING_STEP_CONFIG_MAP } from '@/lib/constants/hunt'
import { cn } from '@/lib/utils'
import type { ReasoningStep } from '@/types'
import type { LucideIcon } from 'lucide-react'

interface ReasoningStepsProps {
  steps: ReasoningStep[]
}

const STEP_ICONS: Record<ReasoningStepStatus, LucideIcon> = {
  [ReasoningStepStatus.COMPLETED]: CheckCircle2,
  [ReasoningStepStatus.IN_PROGRESS]: Loader2,
  [ReasoningStepStatus.PENDING]: Circle,
  [ReasoningStepStatus.ERROR]: Circle,
}

export function ReasoningSteps({ steps }: ReasoningStepsProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {steps.map(step => {
        const config = REASONING_STEP_CONFIG_MAP[step.status]
        const Icon = STEP_ICONS[step.status]

        return (
          <div key={step.id} className="flex items-center gap-2">
            <Icon
              className={cn(
                'h-3.5 w-3.5 shrink-0',
                config.iconClass,
                config.animate && 'animate-spin'
              )}
            />
            <span className={cn('text-xs', config.textClass)}>{step.label}</span>
          </div>
        )
      })}
    </div>
  )
}
