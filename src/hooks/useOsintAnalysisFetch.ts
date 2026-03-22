'use client'

import { useCallback, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { getErrorKey } from '@/lib/api-error'
import { agentConfigService } from '@/services/agent-config.service'

/**
 * Hook to fetch VT analysis results from a VT analysis URL.
 * Used when the initial OSINT query returned an analysis stub
 * (URL/file submission) instead of direct results.
 */
export function useOsintAnalysisFetch() {
  const tErrors = useTranslations('errors')
  const [fetchedData, setFetchedData] = useState<unknown>(null)
  const [isFetching, setIsFetching] = useState(false)

  const handleFetch = useCallback(
    async (analysisUrl: string) => {
      setIsFetching(true)
      try {
        const resp = await agentConfigService.fetchVtAnalysis(analysisUrl)
        setFetchedData(resp.data)
      } catch (error: unknown) {
        Toast.error(tErrors(getErrorKey(error)))
      } finally {
        setIsFetching(false)
      }
    },
    [tErrors]
  )

  return { fetchedData, isFetching, handleFetch }
}
