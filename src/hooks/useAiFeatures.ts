'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { agentConfigService } from '@/services'
import { useTenantStore } from '@/stores'
import type { UpdateAiFeatureConfigInput } from '@/types'

export function useAiFeatures() {
  const tenantId = useTenantStore(s => s.currentTenantId)

  return useQuery({
    queryKey: ['ai-features', tenantId],
    queryFn: () => agentConfigService.getFeatures(),
  })
}

export function useUpdateAiFeature() {
  const queryClient = useQueryClient()
  const tenantId = useTenantStore(s => s.currentTenantId)

  return useMutation({
    mutationFn: ({ featureKey, data }: { featureKey: string; data: UpdateAiFeatureConfigInput }) =>
      agentConfigService.updateFeature(featureKey, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ai-features', tenantId] })
    },
  })
}
