export function getRiskBadgeClass(score: number): string {
  if (score > 80) {
    return 'bg-status-error text-status-error border-status-error'
  }
  if (score > 60) {
    return 'bg-status-warning text-status-warning border-status-warning'
  }
  if (score > 40) {
    return 'bg-status-info text-status-info border-status-info'
  }
  return 'bg-status-neutral text-status-neutral border-status-neutral'
}
