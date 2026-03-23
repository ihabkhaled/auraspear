'use client'

import { useCallback, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { getErrorKey } from '@/lib/api-error'
import { agentConfigService } from '@/services/agent-config.service'
import type { OsintQueryResult } from '@/types'

export function useOsintFileUpload() {
  const tErrors = useTranslations('errors')
  const tCommon = useTranslations('common')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<OsintQueryResult | null>(null)
  const [fetchedData, setFetchedData] = useState<unknown>(null)
  const [isFetchingAnalysis, setIsFetchingAnalysis] = useState(false)

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.currentTarget.files?.item(0)
      if (!file) {
        return
      }

      setIsUploading(true)
      setResult(null)
      setFetchedData(null)

      try {
        const sourcesResp = await agentConfigService.getOsintSources()
        const sources = sourcesResp.data ?? []
        const vtSource = sources.find(s => s.isEnabled && s.sourceType === 'virustotal')

        if (!vtSource) {
          Toast.error(tCommon('noVirusTotalSource'))
          return
        }

        const resp = await agentConfigService.uploadFileForScan(vtSource.id, file)
        setResult(resp)
        Toast.success(tCommon('fileUploadComplete'))
      } catch (error: unknown) {
        Toast.error(tErrors(getErrorKey(error)))
      } finally {
        setIsUploading(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    },
    [tErrors, tCommon]
  )

  const fetchAnalysis = useCallback(
    async (analysisUrl: string, _sourceId: string) => {
      setIsFetchingAnalysis(true)
      try {
        const resp = await agentConfigService.fetchVtAnalysis(analysisUrl)
        setFetchedData(resp.data)
      } catch (error: unknown) {
        Toast.error(tErrors(getErrorKey(error)))
      } finally {
        setIsFetchingAnalysis(false)
      }
    },
    [tErrors]
  )

  const clearResult = useCallback(() => {
    setResult(null)
    setFetchedData(null)
  }, [])

  return {
    fileInputRef,
    handleButtonClick,
    handleFileChange,
    isUploading,
    result,
    clearResult,
    fetchedData,
    isFetchingAnalysis,
    fetchAnalysis,
  }
}
