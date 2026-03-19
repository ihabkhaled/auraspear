'use client'

import { ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { DashboardSectionCardProps } from '@/types'

export function DashboardSectionCard({
  title,
  action,
  children,
  className,
  defaultOpen = true,
}: DashboardSectionCardProps) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <Card className={className}>
        <CardHeader className="pb-2">
          <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between gap-3 text-left">
            <CardTitle className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              {title}
            </CardTitle>
            <div className="flex items-center gap-3">
              {action}
              <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0 cursor-pointer transition-transform [[data-state=open]>&]:rotate-180" />
            </div>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>{children}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
