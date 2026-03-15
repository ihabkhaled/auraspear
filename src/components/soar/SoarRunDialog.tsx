'use client'

import { useEffect } from 'react'
import { useSoarRunDialog } from '@/hooks/useSoarRunDialog'
import type { SoarRunDialogProps } from '@/types'

export function SoarRunDialog(props: SoarRunDialogProps) {
  const { handleRun } = useSoarRunDialog(props)

  useEffect(() => {
    if (props.playbookId) {
      void handleRun()
    }
  }, [props.playbookId, handleRun])

  return null
}
