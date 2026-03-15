'use client'

import { useEffect } from 'react'
import { useSoarDeleteDialog } from '@/hooks/useSoarDeleteDialog'
import type { SoarDeleteDialogProps } from '@/types'

export function SoarDeleteDialog(props: SoarDeleteDialogProps) {
  const { handleDelete } = useSoarDeleteDialog(props)

  useEffect(() => {
    if (props.playbookId) {
      void handleDelete()
    }
  }, [props.playbookId, handleDelete])

  return null
}
