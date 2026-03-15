import { z } from 'zod'
import { ServiceType } from '@/enums'

export const createHealthCheckSchema = z.object({
  serviceName: z.string().min(2),
  serviceType: z.nativeEnum(ServiceType),
  config: z.string().min(2),
})

export const editHealthCheckSchema = z.object({
  serviceName: z.string().min(2),
  serviceType: z.nativeEnum(ServiceType),
  config: z.string().min(2),
})
