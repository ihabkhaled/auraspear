export function getRiskClasses(score: number): string {
  if (score >= 80) {
    return 'bg-severity-critical text-white'
  }
  if (score >= 60) {
    return 'bg-severity-high text-white'
  }
  if (score >= 30) {
    return 'bg-severity-medium text-white'
  }
  return 'bg-severity-low text-white'
}
