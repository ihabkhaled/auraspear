'use client'

import { Play, RefreshCw, Workflow, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWorkspaceActionsPanel } from '@/hooks/useWorkspaceActionsPanel'
import type { WorkspaceActionsPanelProps } from '@/types'
import type { LucideIcon } from 'lucide-react'

const ACTION_ICON_MAP: Record<string, LucideIcon> = {
  play: Play,
  'refresh-cw': RefreshCw,
  workflow: Workflow,
  zap: Zap,
}

export function WorkspaceActionsPanel({
  actions,
  onExecute,
  loading,
  isEditor,
}: WorkspaceActionsPanelProps) {
  const { t } = useWorkspaceActionsPanel()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{t('quickActions')}</CardTitle>
      </CardHeader>
      <CardContent>
        {actions.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-sm">{t('noActions')}</p>
        ) : (
          <div className="space-y-2">
            {actions.map(action => {
              const IconComponent = action.icon ? (ACTION_ICON_MAP[action.icon] ?? Zap) : Zap

              return (
                <Button
                  key={action.key}
                  variant={action.dangerous ? 'destructive' : 'outline'}
                  size="sm"
                  className="w-full justify-start"
                  disabled={loading || (!isEditor && action.requiredRole === 'editor')}
                  onClick={() => onExecute(action.key)}
                >
                  <IconComponent className="me-2 h-3.5 w-3.5" />
                  {action.label}
                </Button>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
