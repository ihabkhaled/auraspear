'use client'

import { cn } from '@/lib/utils'

interface MISPTagPillProps {
  name: string
}

function getTagClasses(name?: string | null): string {
  if (!name) return 'bg-secondary text-secondary-foreground border-border'
  const upper = name.toUpperCase()

  if (upper.startsWith('TLP:RED')) {
    return 'bg-[var(--tag-tlp-red-bg)] text-[var(--tag-tlp-red)] border-[var(--tag-tlp-red-border)]'
  }
  if (upper.startsWith('TLP:AMBER')) {
    return 'bg-[var(--tag-tlp-amber-bg)] text-[var(--tag-tlp-amber)] border-[var(--tag-tlp-amber-border)]'
  }
  if (upper.startsWith('TLP:GREEN')) {
    return 'bg-[var(--tag-tlp-green-bg)] text-[var(--tag-tlp-green)] border-[var(--tag-tlp-green-border)]'
  }
  if (upper.startsWith('TLP:WHITE') || upper.startsWith('TLP:CLEAR')) {
    return 'bg-muted text-muted-foreground border-border'
  }
  if (upper.startsWith('APT-') || upper.startsWith('APT ')) {
    return 'bg-[var(--tag-apt-bg)] text-[var(--tag-apt)] border-[var(--tag-apt-border)]'
  }
  return 'bg-secondary text-secondary-foreground border-border'
}

export function MISPTagPill({ name }: MISPTagPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] leading-tight font-medium',
        getTagClasses(name)
      )}
    >
      {name}
    </span>
  )
}
