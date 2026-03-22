'use client'

import { useCallback, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { getErrorKey } from '@/lib/api-error'
import { agentConfigService } from '@/services'
import type { OsintEnrichmentResult } from '@/types'

export function useOsintEnrichment() {
  const tErrors = useTranslations('errors')
  const tCommon = useTranslations('common')

  const [result, setResult] = useState<OsintEnrichmentResult | null>(null)
  const [isEnriching, setIsEnriching] = useState(false)
  const [fetchedAnalysisData, setFetchedAnalysisData] = useState<Record<string, unknown>>({})
  const [fetchingSourceId, setFetchingSourceId] = useState<string | null>(null)

  const enrich = useCallback(
    async (iocType: string, iocValue: string) => {
      setIsEnriching(true)
      setResult(null)
      setFetchedAnalysisData({})
      try {
        const sourcesResponse = await agentConfigService.getOsintSources()
        const enabledSources = (sourcesResponse?.data ?? []).filter(s => s.isEnabled)

        if (enabledSources.length === 0) {
          Toast.warning(tErrors('osint.sourceNotFound'))
          setIsEnriching(false)
          return
        }

        const sourceIds = enabledSources.map(s => s.id).slice(0, 10)

        const enrichResult = await agentConfigService.enrichIoc({
          iocType,
          iocValue,
          sourceIds,
        })

        const enrichData = enrichResult?.data ?? null
        setResult(enrichData)

        if (enrichData) {
          Toast.success(
            `${tCommon('osintEnrichComplete')}: ${String(enrichData.successCount)}/${String(enrichData.totalSources)}`
          )
        }
      } catch (error: unknown) {
        Toast.error(tErrors(getErrorKey(error)))
      } finally {
        setIsEnriching(false)
      }
    },
    [tErrors, tCommon]
  )

  const fetchAnalysis = useCallback(
    async (analysisUrl: string, sourceId: string) => {
      setFetchingSourceId(sourceId)
      try {
        const resp = await agentConfigService.fetchVtAnalysis(analysisUrl)
        setFetchedAnalysisData(prev => ({ ...prev, [sourceId]: resp.data }))
      } catch (error: unknown) {
        Toast.error(tErrors(getErrorKey(error)))
      } finally {
        setFetchingSourceId(null)
      }
    },
    [tErrors]
  )

  const clearResult = useCallback(() => {
    setResult(null)
    setFetchedAnalysisData({})
  }, [])

  return {
    enrich,
    isEnriching,
    result,
    clearResult,
    fetchedAnalysisData,
    fetchingSourceId,
    fetchAnalysis,
  }
}
