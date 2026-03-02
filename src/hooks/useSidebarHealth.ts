import { ServiceStatus } from '@/enums'
import { computeHealthPercent, computeMaxLatency } from '@/lib/health-utils'
import { useServiceHealth } from './useAdmin'

export function useSidebarHealth() {
  const { data, isLoading } = useServiceHealth()
  const services = data?.data ?? []

  const healthPercent = computeHealthPercent(services)
  const servicesOnline = services.filter(s => s.status === ServiceStatus.HEALTHY).length
  const totalServices = services.length
  const maxLatencyMs = computeMaxLatency(services)

  return { healthPercent, servicesOnline, totalServices, maxLatencyMs, isLoading }
}
