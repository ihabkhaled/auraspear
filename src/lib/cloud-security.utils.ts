/**
 * Returns a Tailwind color class for a compliance score percentage.
 * >= 80 = success (green), >= 50 = warning (yellow), < 50 = error (red).
 */
export function getComplianceScoreClass(score: number): string {
  if (score >= 80) {
    return 'text-status-success'
  }
  if (score >= 50) {
    return 'text-status-warning'
  }
  return 'text-status-error'
}
