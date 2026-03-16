import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { cloudSecurityService } from '@/services'
import { useTenantStore } from '@/stores'
import type { CloudAccountSearchParams, CloudFindingSearchParams } from '@/types'

export function useCloudAccounts(params?: CloudAccountSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['cloud-security', 'accounts', tenantId, params],
    queryFn: () => cloudSecurityService.listAccounts(params),
    placeholderData: keepPreviousData,
  })
}

export function useCloudSecurityStats() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['cloud-security', 'stats', tenantId],
    queryFn: () => cloudSecurityService.getStats(),
  })
}

export function useCreateCloudAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => cloudSecurityService.createAccount(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cloud-security'] })
    },
  })
}

export function useUpdateCloudAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      cloudSecurityService.updateAccount(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cloud-security'] })
    },
  })
}

export function useDeleteCloudAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cloudSecurityService.deleteAccount(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cloud-security'] })
    },
  })
}

export function useCloudFindings(params?: CloudFindingSearchParams) {
  const tenantId = useTenantStore(s => s.currentTenantId)
  return useQuery({
    queryKey: ['cloud-security', 'findings', tenantId, params],
    queryFn: () => cloudSecurityService.listFindings(params),
    enabled: params !== undefined,
    placeholderData: keepPreviousData,
  })
}
