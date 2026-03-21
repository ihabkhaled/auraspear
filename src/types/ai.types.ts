export interface AiTokenUsage {
  input: number
  output: number
}

export interface AiResponse {
  result: string
  reasoning: string[]
  confidence: number
  model: string
  provider: string
  tokensUsed: AiTokenUsage
}

export interface ExplainAnomalyInput {
  metric: string
  value: number
  previousValue: number
  timeRange: string
}

export interface AiUsageSummaryEntry {
  featureKey: string
  provider: string
  totalInputTokens: number
  totalOutputTokens: number
  totalCost: number
  requestCount: number
}

export interface AiUsageSummary {
  tenantId: string
  startDate: string
  endDate: string
  entries: AiUsageSummaryEntry[]
  totals: {
    inputTokens: number
    outputTokens: number
    cost: number
    requests: number
  }
}

export interface AiMonthlyUsage {
  tenantId: string
  month: string
  inputTokens: number
  outputTokens: number
  totalTokens: number
  estimatedCost: number
  requestCount: number
}
