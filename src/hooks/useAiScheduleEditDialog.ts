'use client'

import { useCallback, useMemo, useState } from 'react'
import { deriveScheduleFormState } from '@/lib/ai-config.utils'
import type { AiAgentSchedule, UpdateScheduleInput } from '@/types'

export function useAiScheduleEditDialog(
  schedule: AiAgentSchedule | null,
  onSubmit: (id: string, data: UpdateScheduleInput) => void
) {
  const derived = useMemo(() => deriveScheduleFormState(schedule), [schedule])

  const [cronExpression, setCronExpression] = useState(derived.cronExpression)
  const [timezone, setTimezone] = useState(derived.timezone)
  const [executionMode, setExecutionMode] = useState(derived.executionMode)
  const [riskMode, setRiskMode] = useState(derived.riskMode)
  const [approvalMode, setApprovalMode] = useState(derived.approvalMode)
  const [maxConcurrency, setMaxConcurrency] = useState(derived.maxConcurrency)
  const [providerPreference, setProviderPreference] = useState(derived.providerPreference)
  const [modelPreference, setModelPreference] = useState(derived.modelPreference)

  const resetToSchedule = useCallback(() => {
    const next = deriveScheduleFormState(schedule)
    setCronExpression(next.cronExpression)
    setTimezone(next.timezone)
    setExecutionMode(next.executionMode)
    setRiskMode(next.riskMode)
    setApprovalMode(next.approvalMode)
    setMaxConcurrency(next.maxConcurrency)
    setProviderPreference(next.providerPreference)
    setModelPreference(next.modelPreference)
  }, [schedule])

  const handleSubmit = useCallback(() => {
    if (!schedule) {
      return
    }
    const data: UpdateScheduleInput = {
      cronExpression,
      timezone,
      executionMode,
      riskMode,
      approvalMode,
      maxConcurrency: Number.parseInt(maxConcurrency, 10) || 1,
      providerPreference: providerPreference.length > 0 ? providerPreference : null,
      modelPreference: modelPreference.length > 0 ? modelPreference : null,
    }
    onSubmit(schedule.id, data)
  }, [
    schedule,
    cronExpression,
    timezone,
    executionMode,
    riskMode,
    approvalMode,
    maxConcurrency,
    providerPreference,
    modelPreference,
    onSubmit,
  ])

  return {
    cronExpression,
    setCronExpression,
    timezone,
    setTimezone,
    executionMode,
    setExecutionMode,
    riskMode,
    setRiskMode,
    approvalMode,
    setApprovalMode,
    maxConcurrency,
    setMaxConcurrency,
    providerPreference,
    setProviderPreference,
    modelPreference,
    setModelPreference,
    handleSubmit,
    resetToSchedule,
  }
}
