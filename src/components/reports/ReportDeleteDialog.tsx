'use client'

import { useEffect } from 'react'
import { useReportDeleteDialog } from '@/hooks/useReportDeleteDialog'
import type { ReportDeleteDialogProps } from '@/types'

export function ReportDeleteDialog(props: ReportDeleteDialogProps) {
  const { handleDelete } = useReportDeleteDialog(props)

  useEffect(() => {
    if (props.reportId) {
      void handleDelete()
    }
  }, [props.reportId, handleDelete])

  return null
}
