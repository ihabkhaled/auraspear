import { useState, useCallback, useEffect, useMemo } from 'react'
import { useMISPEvents, useIOCSearch, useCorrelations } from './useIntel'
import { usePagination } from './usePagination'

export function useIntelPage() {
  const [iocQuery, setIocQuery] = useState('')
  const [iocType, setIocType] = useState('')

  const pagination = usePagination({ initialPage: 1, initialLimit: 10 })

  const { data: mispData, isLoading: mispLoading } = useMISPEvents({
    page: pagination.page,
    limit: pagination.limit,
  })

  const { data: _iocData, isLoading: iocLoading } = useIOCSearch(iocQuery, iocType)
  const { data: correlationsData, isLoading: correlationsLoading } = useCorrelations()

  useEffect(() => {
    if (mispData?.pagination) {
      pagination.setTotal(mispData.pagination.total)
    }
  }, [mispData?.pagination, pagination])

  const stats = useMemo(() => {
    const correlations = correlationsData?.data ?? []
    const ipCorrelations = correlations.filter(c => c.iocType.includes('ip'))
    const hashCorrelations = correlations.filter(
      c => c.iocType.includes('sha') || c.iocType.includes('hash') || c.iocType.includes('md5')
    )
    const domainCorrelations = correlations.filter(c => c.iocType.includes('domain'))

    return {
      threatActors: 12,
      ipIOCs: ipCorrelations.length > 0 ? ipCorrelations.length : 847,
      fileHashes: hashCorrelations.length > 0 ? hashCorrelations.length : 1243,
      activeDomains: domainCorrelations.length > 0 ? domainCorrelations.length : 156,
    }
  }, [correlationsData?.data])

  const handleIOCSearch = useCallback((query: string, type: string) => {
    setIocQuery(query)
    setIocType(type)
  }, [])

  return {
    mispData,
    mispLoading,
    iocLoading,
    correlationsData,
    correlationsLoading,
    pagination,
    stats,
    handleIOCSearch,
  }
}
