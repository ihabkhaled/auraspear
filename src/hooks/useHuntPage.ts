import { useCallback, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { HuntStatus, MessageRole } from '@/enums'
import { useHuntStore } from '@/stores'
import { useCreateHuntSession, useSendHuntMessage, useHuntEvents } from './useHunt'

export function useHuntPage() {
  const t = useTranslations('hunt')
  const [mobileTab, setMobileTab] = useState<'chat' | 'results'>('chat')
  const {
    messages,
    huntStatus,
    huntId,
    addMessage,
    setHuntStatus,
    setHuntId,
    clearSession: _clearSession,
  } = useHuntStore()

  const createSession = useCreateHuntSession()
  const sendMessage = useSendHuntMessage()
  const { data: eventsData, isLoading: eventsLoading } = useHuntEvents(huntId ?? '')

  const events = useMemo(
    () => (Array.isArray(eventsData?.data) ? eventsData.data : []),
    [eventsData]
  )

  const uniqueIps = useMemo(() => {
    const ips = new Set<string>()
    for (const event of events) {
      ips.add(event.sourceIp)
    }
    return ips.size
  }, [events])

  const threatScore = useMemo(() => {
    if (events.length === 0) return 0
    return Math.min(100, Math.round(events.length * 4.2))
  }, [events])

  const handleSend = useCallback(
    (content: string) => {
      if (huntId === null) {
        createSession.mutate(
          { query: content, timeRange: '24h' },
          {
            onSuccess: result => {
              const sessionId = result.data.id
              setHuntId(sessionId)
              setHuntStatus(HuntStatus.RUNNING)

              addMessage({
                id: `user-${Date.now()}`,
                role: MessageRole.USER,
                content,
                timestamp: new Date().toISOString(),
              })

              sendMessage.mutate(
                { sessionId, content },
                {
                  onSuccess: response => {
                    addMessage(response.data)
                    if (response.data.actions?.includes('complete')) {
                      setHuntStatus(HuntStatus.COMPLETED)
                    }
                  },
                  onError: () => {
                    Toast.error(t('sendError'))
                    setHuntStatus(HuntStatus.ERROR)
                  },
                }
              )
            },
            onError: () => {
              Toast.error(t('sessionError'))
            },
          }
        )
        return
      }

      addMessage({
        id: `user-${Date.now()}`,
        role: MessageRole.USER,
        content,
        timestamp: new Date().toISOString(),
      })

      sendMessage.mutate(
        { sessionId: huntId, content },
        {
          onSuccess: response => {
            addMessage(response.data)
            if (response.data.actions?.includes('complete')) {
              setHuntStatus(HuntStatus.COMPLETED)
            }
          },
          onError: () => {
            Toast.error(t('sendError'))
            setHuntStatus(HuntStatus.ERROR)
          },
        }
      )
    },
    [huntId, createSession, sendMessage, addMessage, setHuntId, setHuntStatus, t]
  )

  const isSending = createSession.isPending || sendMessage.isPending

  return {
    mobileTab,
    setMobileTab,
    messages,
    huntStatus,
    huntId,
    events,
    uniqueIps,
    threatScore,
    eventsLoading,
    isSending,
    handleSend,
  }
}
