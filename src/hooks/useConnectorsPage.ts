import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { CONNECTOR_TYPES } from '@/lib/constants/connectors.constants'
import { useConnectors } from './useConnectors'

export function useConnectorsPage() {
  const t = useTranslations('connectors')
  const { data: connectors, isLoading, isFetching } = useConnectors()

  const list = connectors ?? []

  const unconfiguredTypes = useMemo(() => {
    const configuredTypes = new Set(list.map(c => c.type))
    return CONNECTOR_TYPES.filter(ct => !configuredTypes.has(ct))
  }, [list])

  return {
    t,
    list,
    isLoading,
    isFetching,
    unconfiguredTypes,
  }
}
