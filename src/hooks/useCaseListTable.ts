import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { getCaseRowClassName } from '@/lib/case.utils'
import type { Case, CaseListTableProps } from '@/types'

type UseCaseListTableProps = Pick<CaseListTableProps, 'currentUserId' | 'isAdmin'>

export function useCaseListTable({ currentUserId, isAdmin }: UseCaseListTableProps) {
  const t = useTranslations('cases')
  const getRowClassName = useCallback(
    (row: Case): string => getCaseRowClassName(row, currentUserId, isAdmin),
    [currentUserId, isAdmin]
  )

  return { t, getRowClassName }
}
