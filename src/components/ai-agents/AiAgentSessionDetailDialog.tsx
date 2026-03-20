'use client'

import { Clock, Coins, Hash, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { AiAgentSession } from '@/types'

interface AiAgentSessionDetailDialogProps {
  session: AiAgentSession | null
  open: boolean
  onClose: () => void
  t: (key: string) => string
  formattedDuration: string
  formattedCost: string
  formattedTokens: string
  formattedStartedAt: string
  formattedCompletedAt: string
}

function getStatusBadgeProps(status: string): {
  variant: 'default' | 'destructive' | 'secondary' | 'outline'
  className: string
} {
  switch (status) {
    case 'completed':
      return { variant: 'default', className: 'bg-status-success text-white' }
    case 'failed':
      return { variant: 'destructive', className: '' }
    case 'cancelled':
      return { variant: 'outline', className: 'border-status-warning text-status-warning' }
    case 'running':
      return { variant: 'secondary', className: '' }
    default:
      return { variant: 'outline', className: '' }
  }
}

export function AiAgentSessionDetailDialog({
  session,
  open,
  onClose,
  t,
  formattedDuration,
  formattedCost,
  formattedTokens,
  formattedStartedAt,
  formattedCompletedAt,
}: AiAgentSessionDetailDialogProps) {
  if (!session) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={nextOpen => !nextOpen && onClose()}>
      <DialogContent className="w-full max-w-[calc(100vw-2rem)] overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('sessionDetailTitle')}</DialogTitle>
          <DialogDescription>{t('sessionDetailDescription')}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="flex flex-col gap-4 pe-4">
            <div className="flex items-center gap-2">
              <Badge
                variant={getStatusBadgeProps(session.status).variant}
                className={cn('capitalize', getStatusBadgeProps(session.status).className)}
              >
                {session.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="bg-muted/50 flex items-center gap-2 rounded-lg p-3">
                <Hash className="text-muted-foreground h-4 w-4 shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">{t('colTokens')}</p>
                  <p className="text-foreground font-mono text-sm font-semibold">
                    {formattedTokens}
                  </p>
                </div>
              </div>
              <div className="bg-muted/50 flex items-center gap-2 rounded-lg p-3">
                <Coins className="text-muted-foreground h-4 w-4 shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">{t('colCost')}</p>
                  <p className="text-foreground font-mono text-sm font-semibold">{formattedCost}</p>
                </div>
              </div>
              <div className="bg-muted/50 flex items-center gap-2 rounded-lg p-3">
                <Zap className="text-muted-foreground h-4 w-4 shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">{t('sessionDuration')}</p>
                  <p className="text-foreground font-mono text-sm font-semibold">
                    {formattedDuration}
                  </p>
                </div>
              </div>
              <div className="bg-muted/50 flex items-center gap-2 rounded-lg p-3">
                <Clock className="text-muted-foreground h-4 w-4 shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">{t('sessionStarted')}</p>
                  <p className="text-foreground text-xs font-medium">{formattedStartedAt}</p>
                </div>
              </div>
            </div>

            {session.completedAt && (
              <div className="text-muted-foreground text-xs">
                {t('sessionCompleted')}: {formattedCompletedAt}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <p className="text-foreground text-sm font-semibold">{t('sessionInput')}</p>
              <div className="bg-muted/50 border-border rounded-lg border p-3">
                <p className="text-foreground text-sm whitespace-pre-wrap">{session.input}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-foreground text-sm font-semibold">{t('sessionOutput')}</p>
              <div className="bg-muted/50 border-border rounded-lg border p-3">
                <p className="text-foreground text-sm whitespace-pre-wrap">
                  {session.output ?? '—'}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
