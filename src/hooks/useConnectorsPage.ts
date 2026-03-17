import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Permission } from '@/enums'
import { CONNECTOR_TYPES } from '@/lib/constants/connectors.constants'
import { hasPermission } from '@/lib/permissions'
import { useAuthStore } from '@/stores'
import { useConnectors } from './useConnectors'

export function useConnectorsPage() {
  const t = useTranslations('connectors')
  const permissions = useAuthStore(s => s.permissions)
  const { data: connectors, isLoading, isFetching } = useConnectors()

  const canCreate = hasPermission(permissions, Permission.CONNECTORS_CREATE)
  const canDelete = hasPermission(permissions, Permission.CONNECTORS_DELETE)

  const list = useMemo(() => connectors ?? [], [connectors])

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
    canCreate,
    canDelete,
  }
}
