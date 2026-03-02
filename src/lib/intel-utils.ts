export function getThreatLevelVariant(
  level: string
): 'destructive' | 'default' | 'secondary' | 'outline' {
  switch (level.toLowerCase()) {
    case 'critical':
    case 'high': {
      return 'destructive'
    }
    case 'medium': {
      return 'default'
    }
    case 'low': {
      return 'secondary'
    }
    default: {
      return 'outline'
    }
  }
}

export function truncateInfo(info: string, maxLength = 60): string {
  if (info.length <= maxLength) return info
  return `${info.slice(0, maxLength)}...`
}

export function getTagClasses(name?: string | null): string {
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
