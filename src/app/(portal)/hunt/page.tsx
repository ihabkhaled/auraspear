'use client'

import { useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { HuntChatPanel, HuntResultsPanel } from '@/components/hunt'
import { Toast } from '@/components/common'
import { useHuntStore } from '@/stores'
import { useCreateHuntSession, useSendHuntMessage, useHuntEvents } from '@/hooks'
import { HuntStatus, MessageRole } from '@/enums'

export default function HuntPage() {
  const t = useTranslations('hunt')
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

  const events = useMemo(() => eventsData?.data ?? [], [eventsData?.data])

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
        createSession.mutate(undefined, {
          onSuccess: (result) => {
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
                onSuccess: (response) => {
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
        })
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
          onSuccess: (response) => {
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

  return (
    <div className="-m-6 flex h-[calc(100vh-3.5rem)] overflow-hidden bg-card">
      <HuntChatPanel
        messages={messages}
        onSend={handleSend}
        disabled={isSending}
      />
      <HuntResultsPanel
        sessionId={huntId ?? ''}
        status={huntStatus ?? HuntStatus.IDLE}
        eventsFound={events.length}
        uniqueIps={uniqueIps}
        threatScore={threatScore}
        events={events}
        loading={eventsLoading}
      />
    </div>
  )
}
