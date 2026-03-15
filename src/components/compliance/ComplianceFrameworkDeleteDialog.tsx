'use client'

import { useEffect } from 'react'
import { useComplianceDeleteDialog } from '@/hooks/useComplianceDeleteDialog'
import type { ComplianceDeleteDialogProps } from '@/types'

export function ComplianceFrameworkDeleteDialog(props: ComplianceDeleteDialogProps) {
  const { handleDelete } = useComplianceDeleteDialog(props)

  useEffect(() => {
    if (props.frameworkId) {
      void handleDelete()
    }
  }, [props.frameworkId, handleDelete])

  return null
}
