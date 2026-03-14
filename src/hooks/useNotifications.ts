import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '@/services'
import { useTenantStore } from '@/stores'

const NOTIFICATIONS_PAGE_SIZE = 15

export function useNotifications() {
  const tenantId = useTenantStore(s => s.currentTenantId)

  return useInfiniteQuery({
    queryKey: ['notifications', tenantId],
    queryFn: ({ pageParam }) =>
      notificationService.getNotifications({ page: pageParam, limit: NOTIFICATIONS_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (lastPage.pagination?.hasNext) {
        return (lastPage.pagination.page ?? 1) + 1
      }
      return
    },
  })
}

export function useUnreadNotificationCount() {
  const tenantId = useTenantStore(s => s.currentTenantId)

  return useQuery({
    queryKey: ['notifications', tenantId, 'unread-count'],
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 30_000,
    staleTime: 15_000,
  })
}

export function useMarkNotificationRead() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications', tenantId] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications', tenantId] })
    },
  })
}
