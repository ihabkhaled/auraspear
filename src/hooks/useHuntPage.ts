import { useCallback, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { HuntStatus, MessageRole, ReasoningStepStatus } from '@/enums'
import { useHuntStore } from '@/stores'
import type { HuntSession } from '@/types'
import { useCreateHuntSession, useSendHuntMessage, useHuntEvents } from './useHunt'

export function useHuntPage() {
  const t = useTranslations('hunt')
  const [mobileTab, setMobileTab] = useState<'chat' | 'results'>('chat')
  const [session, setSession] = useState<HuntSession | null>(null)
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

  // Use backend-computed metrics from session, NOT client-side calculations
  const uniqueIps = session?.uniqueIps ?? 0
  const threatScore = session?.threatScore ?? 0
  const eventsFound = session?.eventsFound ?? 0

  const handleSend = useCallback(
    (content: string) => {
      if (huntId === null) {
        // First message: create hunt session
        createSession.mutate(
          { query: content, timeRange: '24h' },
          {
            onSuccess: result => {
              const sessionData = result.data
              setSession(sessionData)
              setHuntId(sessionData.id)
              setHuntStatus(
                sessionData.status === HuntStatus.COMPLETED
                  ? HuntStatus.COMPLETED
                  : sessionData.status === HuntStatus.ERROR
                    ? HuntStatus.ERROR
                    : HuntStatus.RUNNING
              )

              // Add user message
              addMessage({
                id: `user-${Date.now()}`,
                role: MessageRole.USER,
                content,
                timestamp: new Date().toISOString(),
              })

              // Add AI analysis from session as first AI response
              const hasAnalysis = sessionData.aiAnalysis !== null
              const hasReasoning =
                Array.isArray(sessionData.reasoning) && sessionData.reasoning.length > 0

              if (hasAnalysis || hasReasoning) {
                const reasoningSteps = Array.isArray(sessionData.reasoning)
                  ? sessionData.reasoning
                  : []

                addMessage({
                  id: `ai-${Date.now()}`,
                  role: MessageRole.AI,
                  content: sessionData.aiAnalysis ?? reasoningSteps.join('\n'),
                  timestamp: new Date().toISOString(),
                  reasoningSteps: reasoningSteps.map((step: string, i: number) => ({
                    id: `step-${String(i)}`,
                    label: step,
                    status: ReasoningStepStatus.COMPLETED,
                  })),
                  actions: sessionData.status === HuntStatus.COMPLETED ? ['complete'] : [],
                })

                if (sessionData.status === HuntStatus.COMPLETED) {
                  setHuntStatus(HuntStatus.COMPLETED)
                }
              }
            },
            onError: () => {
              Toast.error(t('sessionError'))
            },
          }
        )
        return
      }

      // Follow-up message: send to AI chat
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
    eventsFound,
    eventsLoading,
    isSending,
    handleSend,
  }
}
