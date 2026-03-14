export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z\d\s-]/g, '')
    .replaceAll(/\s+/g, '-')
    .replaceAll(/-+/g, '-')
}

export function getLevelClasses(level: string): string {
  switch (level) {
    case 'error':
      return 'bg-status-error text-white border-status-error'
    case 'warn':
      return 'bg-status-warning text-white border-status-warning'
    case 'info':
      return 'bg-status-info text-white border-status-info'
    case 'debug':
      return 'bg-muted text-muted-foreground border-border'
    default:
      return ''
  }
}
