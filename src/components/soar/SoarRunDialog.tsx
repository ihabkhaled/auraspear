'use client'

import { useSoarRunDialog } from '@/hooks/useSoarRunDialog'
import type { SoarRunDialogProps } from '@/types'

export function SoarRunDialog(props: SoarRunDialogProps) {
  useSoarRunDialog(props)

  return null
}
