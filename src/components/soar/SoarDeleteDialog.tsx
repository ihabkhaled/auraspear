'use client'

import { useSoarDeleteDialog } from '@/hooks/useSoarDeleteDialog'
import type { SoarDeleteDialogProps } from '@/types'

export function SoarDeleteDialog(props: SoarDeleteDialogProps) {
  useSoarDeleteDialog(props)

  return null
}
