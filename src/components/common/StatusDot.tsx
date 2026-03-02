import { ServiceStatus } from '@/enums'
import { cn } from '@/lib/utils'

type StatusDotSize = 'sm' | 'md'

interface StatusDotProps {
  status: ServiceStatus
  size?: StatusDotSize
}

const STATUS_COLOR_MAP: Record<ServiceStatus, string> = {
  [ServiceStatus.HEALTHY]: 'bg-status-success',
  [ServiceStatus.DEGRADED]: 'bg-status-warning',
  [ServiceStatus.DOWN]: 'bg-status-error',
  [ServiceStatus.MAINTENANCE]: 'bg-status-info',
}

const PING_COLOR_MAP: Record<ServiceStatus, string> = {
  [ServiceStatus.HEALTHY]: 'bg-status-success',
  [ServiceStatus.DEGRADED]: 'bg-status-warning',
  [ServiceStatus.DOWN]: 'bg-status-error',
  [ServiceStatus.MAINTENANCE]: 'bg-status-info',
}

const SIZE_MAP: Record<StatusDotSize, string> = {
  sm: 'h-2 w-2',
  md: 'h-3 w-3',
}

export function StatusDot({ status, size = 'sm' }: StatusDotProps) {
  return (
    <span className="relative inline-flex">
      <span
        className={cn(
          'absolute inline-flex animate-ping rounded-full opacity-75',
          SIZE_MAP[size],
          PING_COLOR_MAP[status]
        )}
      />
      <span
        className={cn(
          'relative inline-flex rounded-full',
          SIZE_MAP[size],
          STATUS_COLOR_MAP[status]
        )}
      />
    </span>
  )
}
