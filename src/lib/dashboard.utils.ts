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

export function getDashboardCardGridClass(count: number): string {
  if (count <= 1) {
    return 'grid-cols-1'
  }

  if (count === 2) {
    return 'grid-cols-1 sm:grid-cols-2'
  }

  if (count === 3) {
    return 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
  }

  if (count === 4) {
    return 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
  }

  if (count === 5) {
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
  }

  if (count === 6) {
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  }

  if (count === 7) {
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7'
  }

  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8'
}

export function formatDashboardPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return 'N/A'
  }

  return `${value}%`
}
