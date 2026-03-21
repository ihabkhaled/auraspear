import { cn } from '@/lib/utils'

interface RiskScoreBadgeProps {
  score: number
}

function getRiskClasses(score: number): string {
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

export function RiskScoreBadge({ score }: RiskScoreBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums',
        getRiskClasses(score)
      )}
    >
      {String(Math.round(score))}
    </span>
  )
}
