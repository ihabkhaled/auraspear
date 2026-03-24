'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { agentConfigService } from '@/services'
import { useTenantStore } from '@/stores'
import type { UpdateScheduleInput } from '@/types'

export function useAiSchedules() {
  const tenantId = useTenantStore(s => s.currentTenantId)

  return useQuery({
    queryKey: ['ai-schedules', tenantId],
    queryFn: () => agentConfigService.getSchedules(),
  })
}

export function useToggleSchedule() {
  const queryClient = useQueryClient()
  const tenantId = useTenantStore(s => s.currentTenantId)

  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      agentConfigService.toggleSchedule(id, enabled),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ai-schedules', tenantId] })
    },
  })
}

export function usePauseSchedule() {
  const queryClient = useQueryClient()
  const tenantId = useTenantStore(s => s.currentTenantId)

  return useMutation({
    mutationFn: ({ id, paused }: { id: string; paused: boolean }) =>
      agentConfigService.pauseSchedule(id, paused),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ai-schedules', tenantId] })
    },
  })
}

export function useRunScheduleNow() {
  const queryClient = useQueryClient()
  const tenantId = useTenantStore(s => s.currentTenantId)

  return useMutation({
    mutationFn: (id: string) => agentConfigService.runScheduleNow(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ai-schedules', tenantId] })
    },
  })
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient()
  const tenantId = useTenantStore(s => s.currentTenantId)

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateScheduleInput }) =>
      agentConfigService.updateSchedule(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ai-schedules', tenantId] })
    },
  })
}

export function useResetSchedule() {
  const queryClient = useQueryClient()
  const tenantId = useTenantStore(s => s.currentTenantId)

  return useMutation({
    mutationFn: (id: string) => agentConfigService.resetSchedule(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ai-schedules', tenantId] })
    },
  })
}
