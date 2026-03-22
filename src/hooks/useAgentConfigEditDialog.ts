'use client'

import { useCallback, useRef, useState } from 'react'
import { type AiTriggerMode, type AiOutputFormat } from '@/enums'
import { deriveAgentConfigState } from '@/lib/ai-config.utils'
import type { TenantAgentConfig, UpdateAgentConfigInput } from '@/types'

export function useAgentConfigEditDialog(
  config: TenantAgentConfig | null,
  onSubmit: (agentId: string, data: UpdateAgentConfigInput) => void
) {
  const [enabled, setEnabled] = useState(false)
  const [providerMode, setProviderMode] = useState('default')
  const [model, setModel] = useState('')
  const [temperature, setTemperature] = useState('0.7')
  const [maxTokens, setMaxTokens] = useState('4096')
  const [triggerMode, setTriggerMode] = useState<AiTriggerMode>('manual_only' as AiTriggerMode)
  const [outputFormat, setOutputFormat] = useState<AiOutputFormat>('markdown' as AiOutputFormat)
  const [presentationSkills, setPresentationSkills] = useState(false)
  const [systemPrompt, setSystemPrompt] = useState('')
  const [promptSuffix, setPromptSuffix] = useState('')
  const [indexPatterns, setIndexPatterns] = useState('')
  const [tokensPerHourLimit, setTokensPerHourLimit] = useState('10000')
  const [tokensPerDayLimit, setTokensPerDayLimit] = useState('100000')
  const [tokensPerMonthLimit, setTokensPerMonthLimit] = useState('1000000')
  const [maxConcurrentRuns, setMaxConcurrentRuns] = useState('3')

  // Track the config identity — when it changes, reset form on next resetToConfig call
  const lastSyncedRef = useRef<string | null>(null)
  const configKey = config ? `${config.agentId}:${String(config.hasCustomConfig)}:${config.outputFormat}:${String(config.isEnabled)}:${config.providerMode}` : null

  // If config identity changed since last sync, auto-reset
  if (configKey !== null && lastSyncedRef.current !== configKey) {
    const next = deriveAgentConfigState(config)
    setEnabled(next.enabled)
    setProviderMode(next.providerMode)
    setModel(next.model)
    setTemperature(next.temperature)
    setMaxTokens(next.maxTokens)
    setTriggerMode(next.triggerMode)
    setOutputFormat(next.outputFormat)
    setPresentationSkills(next.presentationSkills)
    setSystemPrompt(next.systemPrompt)
    setPromptSuffix(next.promptSuffix)
    setIndexPatterns(next.indexPatterns)
    setTokensPerHourLimit(next.tokensPerHourLimit)
    setTokensPerDayLimit(next.tokensPerDayLimit)
    setTokensPerMonthLimit(next.tokensPerMonthLimit)
    setMaxConcurrentRuns(next.maxConcurrentRuns)
    lastSyncedRef.current = configKey
  }

  const resetToConfig = useCallback(() => {
    const next = deriveAgentConfigState(config)
    setEnabled(next.enabled)
    setProviderMode(next.providerMode)
    setModel(next.model)
    setTemperature(next.temperature)
    setMaxTokens(next.maxTokens)
    setTriggerMode(next.triggerMode)
    setOutputFormat(next.outputFormat)
    setPresentationSkills(next.presentationSkills)
    setSystemPrompt(next.systemPrompt)
    setPromptSuffix(next.promptSuffix)
    setIndexPatterns(next.indexPatterns)
    setTokensPerHourLimit(next.tokensPerHourLimit)
    setTokensPerDayLimit(next.tokensPerDayLimit)
    setTokensPerMonthLimit(next.tokensPerMonthLimit)
    setMaxConcurrentRuns(next.maxConcurrentRuns)
    lastSyncedRef.current = configKey
  }, [config])

  const handleSubmit = useCallback(() => {
    if (!config) {
      return
    }
    const data: UpdateAgentConfigInput = {
      isEnabled: enabled,
      providerMode,
      model: model.length > 0 ? model : null,
      temperature: Number.parseFloat(temperature) || 0.7,
      maxTokensPerCall: Number.parseInt(maxTokens, 10) || 2048,
      triggerMode,
      outputFormat,
      presentationSkills: presentationSkills ? ['summary', 'visualization'] : [],
      systemPrompt: systemPrompt.length > 0 ? systemPrompt : null,
      promptSuffix: promptSuffix.length > 0 ? promptSuffix : null,
      indexPatterns: indexPatterns
        .split(',')
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0),
      tokensPerHour: Number.parseInt(tokensPerHourLimit, 10) || 10000,
      tokensPerDay: Number.parseInt(tokensPerDayLimit, 10) || 100000,
      tokensPerMonth: Number.parseInt(tokensPerMonthLimit, 10) || 1000000,
      maxConcurrentRuns: Number.parseInt(maxConcurrentRuns, 10) || 3,
    }
    onSubmit(config.agentId, data)
  }, [
    config,
    enabled,
    providerMode,
    model,
    temperature,
    maxTokens,
    triggerMode,
    outputFormat,
    presentationSkills,
    systemPrompt,
    promptSuffix,
    indexPatterns,
    tokensPerHourLimit,
    tokensPerDayLimit,
    tokensPerMonthLimit,
    maxConcurrentRuns,
    onSubmit,
  ])

  return {
    enabled,
    setEnabled,
    providerMode,
    setProviderMode,
    model,
    setModel,
    temperature,
    setTemperature,
    maxTokens,
    setMaxTokens,
    triggerMode,
    setTriggerMode,
    outputFormat,
    setOutputFormat,
    presentationSkills,
    setPresentationSkills,
    systemPrompt,
    setSystemPrompt,
    promptSuffix,
    setPromptSuffix,
    indexPatterns,
    setIndexPatterns,
    tokensPerHourLimit,
    setTokensPerHourLimit,
    tokensPerDayLimit,
    setTokensPerDayLimit,
    tokensPerMonthLimit,
    setTokensPerMonthLimit,
    maxConcurrentRuns,
    setMaxConcurrentRuns,
    handleSubmit,
    resetToConfig,
  }
}
