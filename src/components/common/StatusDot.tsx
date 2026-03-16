import { ServiceStatus, StatusDotSize } from '@/enums'
import { cn, lookup } from '@/lib/utils'
import type { StatusDotProps } from '@/types'

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
  [StatusDotSize.SM]: 'h-2 w-2',
  [StatusDotSize.MD]: 'h-3 w-3',
}

export function StatusDot({ status, size = StatusDotSize.SM }: StatusDotProps) {
  return (
    <span className="relative inline-flex">
      <span
        className={cn(
          'absolute inline-flex animate-ping rounded-full opacity-75',
          lookup(SIZE_MAP, size),
          lookup(PING_COLOR_MAP, status)
        )}
      />
      <span
        className={cn(
          'relative inline-flex rounded-full',
          lookup(SIZE_MAP, size),
          lookup(STATUS_COLOR_MAP, status)
        )}
      />
    </span>
  )
}
