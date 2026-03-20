import { afterEach, describe, expect, it, type Mock, vi } from 'vitest'
import api from '@/lib/api'
import { dashboardService } from '@/services/dashboard.service'
vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockGet = api.get as Mock

describe('dashboardService', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('calls the operations overview endpoint', async () => {
    const payload = {
      tenantId: 'tenant-1',
      incidentStatus: [],
      caseAging: {
        openCases: 0,
        unassignedCases: 0,
        agedOverSevenDays: 0,
        agedOverFourteenDays: 0,
        meanOpenAgeHours: 0,
      },
      rulePerformance: {
        activeRules: 0,
        topRules: [],
        noisyRules: [],
      },
      connectorSync: {
        completedRuns7d: 0,
        failedRuns7d: 0,
        runningSyncs: 0,
        topFailingConnectors: [],
      },
      runtimeBacklog: {
        pendingJobs: 0,
        retryingJobs: 0,
        failedJobs: 0,
        staleRunningJobs: 0,
        queuedConnectorSyncJobs: 0,
        queuedReportJobs: 0,
      },
      automationQuality: {
        aiSessions24h: 0,
        successfulAiSessions24h: 0,
        failedAiSessions24h: 0,
        averageAiDurationSeconds: 0,
        completedSoarRuns30d: 0,
        failedSoarRuns30d: 0,
        averageSoarCompletionRate: 0,
      },
      exposureSummary: {
        criticalVulnerabilities: 0,
        exploitAvailableVulnerabilities: 0,
        openCloudFindings: 0,
        criticalCloudFindings: 0,
        passedControls: 0,
        failedControls: 0,
      },
    }

    mockGet.mockResolvedValue({ data: { data: payload } })

    const result = await dashboardService.getOperationsOverview()

    expect(mockGet).toHaveBeenCalledWith('/dashboard/operations-overview')
    expect(result).toEqual({ data: payload })
  })
})
