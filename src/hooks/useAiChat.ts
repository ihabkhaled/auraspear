'use client'

import { useCallback, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { getErrorKey } from '@/lib/api-error'
import { agentConfigService } from '@/services'
import { useTenantStore } from '@/stores'
import type { AiChatMessage, AiChatThread } from '@/types'

export function useAiChat() {
  const t = useTranslations('aiConfig')
  const tErrors = useTranslations('errors')
  const tenantId = useTenantStore(s => s.currentTenantId)
  const queryClient = useQueryClient()
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Thread list
  const threadsQuery = useQuery({
    queryKey: ['ai-chat-threads', tenantId],
    queryFn: () => agentConfigService.listChatThreads({ page: 1, limit: 50 }),
  })

  const threads: AiChatThread[] = threadsQuery.data?.data ?? []

  // Messages for selected thread
  const messagesQuery = useQuery({
    queryKey: ['ai-chat-messages', tenantId, selectedThreadId],
    queryFn: () =>
      agentConfigService.getChatMessages(selectedThreadId ?? '', { page: 1, limit: 100 }),
    enabled: Boolean(selectedThreadId),
  })

  const messages: AiChatMessage[] = messagesQuery.data?.data ?? []

  // Create thread
  const createThreadMutation = useMutation({
    mutationFn: (data: { connectorId?: string; model?: string; systemPrompt?: string }) =>
      agentConfigService.createChatThread(data),
    onSuccess: result => {
      const thread = result?.data as AiChatThread | undefined
      if (thread) {
        setSelectedThreadId(thread.id)
      }
      Toast.success(t('chatCreated'))
      void queryClient.invalidateQueries({ queryKey: ['ai-chat-threads', tenantId] })
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
    },
  })

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: ({ threadId, content }: { threadId: string; content: string }) =>
      agentConfigService.sendChatMessage(threadId, content),
    onSuccess: () => {
      setMessageInput('')
      void queryClient.invalidateQueries({
        queryKey: ['ai-chat-messages', tenantId, selectedThreadId],
      })
      void queryClient.invalidateQueries({ queryKey: ['ai-chat-threads', tenantId] })
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
    },
  })

  // Archive thread
  const archiveThreadMutation = useMutation({
    mutationFn: (threadId: string) => agentConfigService.archiveChatThread(threadId),
    onSuccess: () => {
      Toast.success(t('chatArchived'))
      setSelectedThreadId(null)
      void queryClient.invalidateQueries({ queryKey: ['ai-chat-threads', tenantId] })
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
    },
  })

  const handleSendMessage = useCallback(() => {
    if (!selectedThreadId || !messageInput.trim()) return
    sendMessageMutation.mutate({ threadId: selectedThreadId, content: messageInput.trim() })
  }, [selectedThreadId, messageInput, sendMessageMutation])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [handleSendMessage]
  )

  const selectedThread = threads.find(thread => thread.id === selectedThreadId) ?? null

  return {
    t,
    threads,
    threadsLoading: threadsQuery.isLoading,
    selectedThreadId,
    setSelectedThreadId,
    selectedThread,
    messages,
    messagesLoading: messagesQuery.isLoading,
    messageInput,
    setMessageInput,
    handleSendMessage,
    handleKeyDown,
    isSending: sendMessageMutation.isPending,
    messagesEndRef,
    createThread: createThreadMutation.mutate,
    isCreatingThread: createThreadMutation.isPending,
    archiveThread: archiveThreadMutation.mutate,
  }
}
