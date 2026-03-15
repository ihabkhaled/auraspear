import { useTranslations } from 'next-intl'
import { formatRelativeTime } from '@/lib/utils'
import type { Incident } from '@/types'

export function useIncidentDetailPanel(incident: Incident | null) {
  const t = useTranslations('incidents')
  const tCommon = useTranslations('common')

  const formattedCreatedAt = incident?.createdAt ? formatRelativeTime(incident.createdAt) : '-'
  const formattedUpdatedAt = incident?.updatedAt ? formatRelativeTime(incident.updatedAt) : '-'
  const formattedResolvedAt = incident?.resolvedAt ? formatRelativeTime(incident.resolvedAt) : null

  return {
    t,
    tCommon,
    formattedCreatedAt,
    formattedUpdatedAt,
    formattedResolvedAt,
  }
}
