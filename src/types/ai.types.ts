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

/* ── FinOps types ────────────────────────────────────────── */

export interface AiUsageByUserEntry {
  userId: string
  totalInputTokens: number
  totalOutputTokens: number
  totalCost: number
  requestCount: number
}

export interface AiUsageByModelEntry {
  provider: string
  model: string | null
  totalInputTokens: number
  totalOutputTokens: number
  totalCost: number
  requestCount: number
}

export interface AiDailyUsageEntry {
  date: string
  inputTokens: number
  outputTokens: number
  cost: number
  requests: number
}

export interface AiFinopsDashboard {
  tenantId: string
  month: string
  totalCost: number
  totalTokens: number
  totalRequests: number
  budgetTotal: number | null
  budgetUsedPct: number | null
  projectedMonthEnd: number
  byFeature: AiUsageSummaryEntry[]
  byUser: AiUsageByUserEntry[]
  byModel: AiUsageByModelEntry[]
  dailyTrend: AiDailyUsageEntry[]
}

export interface AiCostRate {
  id: string
  tenantId: string
  provider: string
  model: string
  inputCostPer1k: number
  outputCostPer1k: number
  effectiveFrom: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface AiBudgetAlert {
  id: string
  tenantId: string
  scope: string
  scopeKey: string | null
  monthlyBudget: number
  alertThresholds: string
  lastAlertPct: number
  lastAlertAt: string | null
  enabled: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

/* ── Transcript & Compliance types ───────────────────── */

export interface AiTranscriptStats {
  totalThreads: number
  totalMessages: number
  totalAuditLogs: number
  threadsOnHold: number
  threadsRedacted: number
}

export interface AiTranscriptPolicy {
  id: string
  tenantId: string
  chatRetentionDays: number
  auditRetentionDays: number
  autoRedactPii: boolean
  requireLegalHold: boolean
  lastCleanupAt: string | null
  lastCleanupCount: number
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface AiTranscriptThread {
  id: string
  tenantId: string
  userId: string
  title: string | null
  model: string | null
  provider: string | null
  messageCount: number
  totalTokensUsed: number
  lastActivityAt: string
  isArchived: boolean
  legalHold: boolean
  complianceStatus: string
  redactedAt: string | null
  createdAt: string
}

export interface AiAuditLogEntry {
  id: string
  tenantId: string
  actor: string
  action: string
  model: string
  inputTokens: number
  outputTokens: number
  prompt: string | null
  response: string | null
  durationMs: number | null
  createdAt: string
}

export interface AiTranscriptMessage {
  id: string
  threadId: string
  role: string
  content: string
  model: string | null
  provider: string | null
  inputTokens: number
  outputTokens: number
  durationMs: number | null
  sequenceNum: number
  createdAt: string
}
