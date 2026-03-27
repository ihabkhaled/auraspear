'use client'

import { Bot, Loader2, MessageSquare, Plus, Send, Trash2, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useAiChat } from '@/hooks/useAiChat'
import { useAvailableAiConnectors } from '@/hooks/useAvailableAiConnectors'
import { formatDate, cn } from '@/lib/utils'
import type { AiChatMessage, AiChatThread } from '@/types'

function ThreadItem({
  thread,
  isSelected,
  onSelect,
}: {
  thread: AiChatThread
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      className={cn(
        'w-full rounded-lg p-3 text-start transition-colors',
        isSelected
          ? 'bg-primary/10 border-primary border'
          : 'hover:bg-muted border border-transparent'
      )}
      onClick={onSelect}
    >
      <p className="truncate text-sm font-medium">{thread.title ?? 'Untitled Chat'}</p>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-muted-foreground text-xs">{thread.provider ?? 'default'}</span>
        <span className="text-muted-foreground text-xs">{String(thread.messageCount)} msgs</span>
      </div>
      <p className="text-muted-foreground mt-0.5 text-xs">{formatDate(thread.lastActivityAt)}</p>
    </button>
  )
}

function ChatMessage({ message }: { message: AiChatMessage }) {
  const isUser = message.role === 'user'
  return (
    <div className={cn('flex gap-3 py-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
          <Bot className="text-primary h-4 w-4" />
        </div>
      )}
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-2.5',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        {!isUser && message.model && (
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {message.model}
            </Badge>
            {message.durationMs !== null && (
              <span className="text-muted-foreground text-xs">{String(message.durationMs)}ms</span>
            )}
          </div>
        )}
      </div>
      {isUser && (
        <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
          <User className="text-muted-foreground h-4 w-4" />
        </div>
      )}
    </div>
  )
}

export function AiChatPanel() {
  const {
    t,
    threads,
    threadsLoading,
    selectedThreadId,
    setSelectedThreadId,
    selectedThread,
    messages,
    messagesLoading,
    messageInput,
    setMessageInput,
    handleSendMessage,
    handleKeyDown,
    isSending,
    messagesEndRef,
    createThread,
    isCreatingThread,
    archiveThread,
  } = useAiChat()

  const { availableConnectors, selectedConnector, setSelectedConnector, connectorValue } =
    useAvailableAiConnectors()

  return (
    <div className="border-border flex h-[600px] overflow-hidden rounded-lg border">
      {/* Thread sidebar */}
      <div className="border-border flex w-72 shrink-0 flex-col border-e">
        <div className="border-border space-y-2 border-b p-3">
          <Select value={selectedConnector} onValueChange={setSelectedConnector}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('featureProvider')} />
            </SelectTrigger>
            <SelectContent>
              {availableConnectors.map(c => (
                <SelectItem key={c.key} value={c.key}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="w-full"
            size="sm"
            onClick={() => createThread(connectorValue ? { connectorId: connectorValue } : {})}
            disabled={isCreatingThread}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            {t('newChat')}
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {threadsLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
              </div>
            )}
            {!threadsLoading && threads.length === 0 && (
              <p className="text-muted-foreground px-3 py-8 text-center text-xs">{t('noChats')}</p>
            )}
            {threads.map(thread => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                isSelected={thread.id === selectedThreadId}
                onSelect={() => setSelectedThreadId(thread.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col">
        {selectedThreadId ? (
          <>
            {/* Header */}
            <div className="border-border flex items-center justify-between border-b px-4 py-2.5">
              <div>
                <p className="text-sm font-medium">{selectedThread?.title ?? 'Untitled Chat'}</p>
                <p className="text-muted-foreground text-xs">
                  {selectedThread?.provider ?? 'default'} · {selectedThread?.model ?? 'auto'}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => archiveThread(selectedThreadId)}>
                <Trash2 className="text-destructive h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-4">
              {messagesLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
                </div>
              )}
              {!messagesLoading && messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Bot className="text-muted-foreground mb-3 h-8 w-8" />
                  <p className="text-muted-foreground text-sm">{t('chatPlaceholder')}</p>
                </div>
              )}
              {!messagesLoading && messages.length > 0 && (
                <div className="py-4">
                  {messages.map(msg => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <Separator />
            <div className="flex items-end gap-2 p-3">
              <Textarea
                value={messageInput}
                onChange={e => setMessageInput(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('chatPlaceholder')}
                rows={2}
                className="min-h-[60px] resize-none"
                disabled={isSending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isSending || !messageInput.trim()}
                size="icon"
                className="h-10 w-10 shrink-0"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <MessageSquare className="text-muted-foreground h-12 w-12" />
            <p className="text-muted-foreground text-sm">{t('chatDescription')}</p>
            <p className="text-muted-foreground text-xs">{t('noChats')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
