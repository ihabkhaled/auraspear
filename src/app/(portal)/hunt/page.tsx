'use client'

import { useCallback, useMemo, useState } from 'react'
import { MessageSquare, BarChart3 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { HuntChatPanel, HuntResultsPanel } from '@/components/hunt'
import { Button } from '@/components/ui/button'
import { HuntStatus, MessageRole } from '@/enums'
import { useCreateHuntSession, useSendHuntMessage, useHuntEvents } from '@/hooks'
import { useHuntStore } from '@/stores'

export default function HuntPage() {
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

  return (
    <div className="bg-card -m-4 flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden md:-m-6">
      {/* Mobile tab bar */}
      <div className="border-border flex border-b lg:hidden">
        <Button
          variant={mobileTab === 'chat' ? 'default' : 'ghost'}
          className="flex-1 rounded-none"
          onClick={() => setMobileTab('chat')}
        >
          <MessageSquare className="h-4 w-4" />
          {t('chatTitle')}
        </Button>
        <Button
          variant={mobileTab === 'results' ? 'default' : 'ghost'}
          className="flex-1 rounded-none"
          onClick={() => setMobileTab('results')}
        >
          <BarChart3 className="h-4 w-4" />
          {t('resultsTitle')}
        </Button>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Chat panel: visible on mobile when tab=chat, always visible on desktop */}
        <div className={mobileTab === 'chat' ? 'flex flex-1 lg:flex-none' : 'hidden lg:flex'}>
          <HuntChatPanel messages={messages} onSend={handleSend} disabled={isSending} />
        </div>

        {/* Results panel: visible on mobile when tab=results, always visible on desktop */}
        <div className={mobileTab === 'results' ? 'flex flex-1' : 'hidden lg:flex lg:flex-1'}>
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
      </div>
    </div>
  )
}
