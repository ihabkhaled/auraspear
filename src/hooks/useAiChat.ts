'use client'

import { useCallback, useState } from 'react'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

  // Thread list with cursor-based infinite loading
  const threadsQuery = useInfiniteQuery({
    queryKey: ['ai-chat-threads', tenantId],
    queryFn: ({ pageParam }) => {
      const params: { limit: number; cursor?: string } = { limit: 20 }
      if (pageParam) {
        params.cursor = pageParam as string
      }
      return agentConfigService.listChatThreads(params)
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  })

  const threads: AiChatThread[] = threadsQuery.data
    ? threadsQuery.data.pages.flatMap(page => page.data)
    : []
  const hasMoreThreads = threadsQuery.hasNextPage ?? false

  // Messages with cursor-based infinite query (loads older on scroll up)
  const messagesQuery = useInfiniteQuery({
    queryKey: ['ai-chat-messages', tenantId, selectedThreadId],
    queryFn: ({ pageParam }) => {
      const params: { limit: number; cursor?: string; direction?: string } = {
        limit: 30,
        direction: 'older',
      }
      if (pageParam) {
        params.cursor = pageParam as string
      }
      return agentConfigService.getChatMessages(selectedThreadId ?? '', params)
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => (lastPage.hasMore ? lastPage.nextCursor : undefined),
    enabled: Boolean(selectedThreadId),
  })

  // Flatten all pages into a single messages array (chronological order)
  const allMessages: AiChatMessage[] = messagesQuery.data
    ? [...messagesQuery.data.pages].reverse().flatMap(page => page.data)
    : []

  // Reset when selecting a thread
  const handleSelectThread = useCallback(
    (threadId: string) => {
      setSelectedThreadId(threadId)
      void queryClient.resetQueries({ queryKey: ['ai-chat-messages', tenantId, threadId] })
    },
    [queryClient, tenantId]
  )

  // Create thread
  const createThreadMutation = useMutation({
    mutationFn: (data: { connectorId?: string; model?: string; systemPrompt?: string }) =>
      agentConfigService.createChatThread(data),
    onSuccess: result => {
      const newThread = result?.data as AiChatThread | undefined
      if (newThread) {
        setSelectedThreadId(newThread.id)
      }
      Toast.success(t('chatCreated'))
      void queryClient.invalidateQueries({ queryKey: ['ai-chat-threads', tenantId] })
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
    },
  })

  // Send message with per-message model override
  const sendMessageMutation = useMutation({
    mutationFn: ({
      threadId,
      content,
      model,
      connectorId,
    }: {
      threadId: string
      content: string
      model?: string
      connectorId?: string
    }) => {
      const overrides: { model?: string; connectorId?: string } = {}
      if (model) overrides.model = model
      if (connectorId) overrides.connectorId = connectorId
      return agentConfigService.sendChatMessage(threadId, content, overrides)
    },
    onSuccess: () => {
      setMessageInput('')
      void queryClient.invalidateQueries({
        queryKey: ['ai-chat-messages', tenantId, selectedThreadId],
      })
      void queryClient.invalidateQueries({ queryKey: ['ai-chat-threads', tenantId] })
    },
    onError: (error: unknown) => {
      Toast.error(tErrors(getErrorKey(error)))
    },
  })

  // Update thread (change model/connector mid-chat)
  const updateThreadMutation = useMutation({
    mutationFn: ({
      threadId,
      data,
    }: {
      threadId: string
      data: { connectorId?: string; model?: string }
    }) => agentConfigService.updateChatThread(threadId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ai-chat-threads', tenantId] })
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
    hasMoreThreads,
    fetchMoreThreads: threadsQuery.fetchNextPage,
    isFetchingMoreThreads: threadsQuery.isFetchingNextPage,
    selectedThreadId,
    handleSelectThread,
    selectedThread,
    messages: allMessages,
    messagesLoading: messagesQuery.isLoading,
    messagesFetching: messagesQuery.isFetching,
    hasOlderMessages: messagesQuery.hasNextPage ?? false,
    fetchOlderMessages: messagesQuery.fetchNextPage,
    isFetchingOlder: messagesQuery.isFetchingNextPage,
    messageInput,
    setMessageInput,
    handleSendMessage,
    handleKeyDown,
    isSending: sendMessageMutation.isPending,
    createThread: createThreadMutation.mutate,
    isCreatingThread: createThreadMutation.isPending,
    updateThread: updateThreadMutation.mutate,
    archiveThread: archiveThreadMutation.mutate,
  }
}
