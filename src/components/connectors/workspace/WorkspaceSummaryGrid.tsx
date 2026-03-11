'use client'

import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Brain,
  CheckCircle,
  Database,
  Folder,
  GitBranch,
  Globe,
  Laptop,
  LayoutDashboard,
  List,
  Monitor,
  RefreshCw,
  Shield,
  ShieldCheck,
  Tag,
  Wifi,
  Workflow,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { CardVariant } from '@/enums'
import { cn } from '@/lib/utils'
import type { WorkspaceSummaryCard } from '@/types'
import type { LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  activity: Activity,
  'alert-circle': AlertCircle,
  'alert-triangle': AlertTriangle,
  'arrow-down': ArrowDown,
  'arrow-up': ArrowUp,
  brain: Brain,
  'check-circle': CheckCircle,
  database: Database,
  folder: Folder,
  'git-branch': GitBranch,
  globe: Globe,
  laptop: Laptop,
  'layout-dashboard': LayoutDashboard,
  list: List,
  monitor: Monitor,
  'refresh-cw': RefreshCw,
  shield: Shield,
  'shield-check': ShieldCheck,
  tag: Tag,
  wifi: Wifi,
  workflow: Workflow,
}

const VARIANT_CLASSES: Record<CardVariant, string> = {
  [CardVariant.DEFAULT]: 'text-foreground',
  [CardVariant.SUCCESS]: 'text-status-success',
  [CardVariant.WARNING]: 'text-status-warning',
  [CardVariant.ERROR]: 'text-status-error',
  [CardVariant.INFO]: 'text-status-info',
}

interface WorkspaceSummaryGridProps {
  cards: WorkspaceSummaryCard[]
  loading?: boolean
}

export function WorkspaceSummaryGrid({ cards, loading }: WorkspaceSummaryGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="bg-muted h-16 animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (cards.length === 0) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(card => {
        const IconComponent = card.icon ? ICON_MAP[card.icon] : undefined
        const variantClass = VARIANT_CLASSES[card.variant ?? CardVariant.DEFAULT]

        return (
          <Card key={card.key}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium">{card.label}</p>
                  <p className={cn('text-2xl font-bold', variantClass)}>
                    {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                  </p>
                  {card.change && <p className="text-muted-foreground text-xs">{card.change}</p>}
                </div>
                {IconComponent && (
                  <div className={cn('rounded-lg p-2', variantClass, 'opacity-60')}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
