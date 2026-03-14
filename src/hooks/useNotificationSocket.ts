'use client'

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { io, type Socket } from 'socket.io-client'
import { Toast } from '@/components/common'
import { AUTH_STORAGE_KEY } from '@/lib/constants/storage'
import type { AuthStorageState } from '@/types'

const BACKEND_WS_URL = process.env['NEXT_PUBLIC_WS_URL'] ?? 'http://localhost:4000'

function getAccessToken(): string {
  if (typeof window === 'undefined') return ''
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return ''
    const parsed = JSON.parse(raw) as AuthStorageState
    return parsed.state?.accessToken ?? ''
  } catch {
    return ''
  }
}

/**
 * Connects to the backend WebSocket namespace for real-time notifications.
 * Automatically invalidates React Query caches when events arrive.
 */
export function useNotificationSocket(): void {
  const queryClient = useQueryClient()
  const t = useTranslations('notifications')
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const token = getAccessToken()
    if (!token) return

    const socket = io(`${BACKEND_WS_URL}/notifications`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 3000,
    })

    socketRef.current = socket

    socket.on('notification', () => {
      // Invalidate notification list so it refetches
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })
      // Show toast
      Toast.info(t('newNotification'))
    })

    socket.on('unread-count', (data: { count: number }) => {
      // Directly update the cached unread count for instant UI update
      queryClient.setQueryData(['notifications', 'unread-count'], { count: data.count })
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [queryClient, t])
}
