'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSystemHealthDeleteDialog } from '@/hooks/useSystemHealthDeleteDialog'
import type { SystemHealthDeleteDialogProps } from '@/types'

export function SystemHealthDeleteDialog({
  serviceName,
  onConfirm,
  loading = false,
}: SystemHealthDeleteDialogProps) {
  const { handleDelete } = useSystemHealthDeleteDialog({ serviceName, onConfirm })

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
