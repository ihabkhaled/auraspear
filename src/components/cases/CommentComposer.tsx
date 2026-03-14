'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useMentionableUsers } from '@/hooks'
import { useDebounce } from '@/hooks/useDebounce'
import { COMMENT_MAX_LENGTH, COMMENT_MENTIONS_MAX } from '@/lib/constants/cases'
import { cn } from '@/lib/utils'
import type { MentionableUser } from '@/types'

interface CommentComposerProps {
  caseId: string
  currentUserId: string
  onSubmit: (body: string, mentionedUserIds: string[]) => void
  loading?: boolean
  disabled?: boolean
}

export function CommentComposer({
  caseId,
  currentUserId,
  onSubmit,
  loading,
  disabled,
}: CommentComposerProps) {
  const t = useTranslations('cases.comments')
  const [body, setBody] = useState('')
  const [mentionQuery, setMentionQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedMentions, setSelectedMentions] = useState<MentionableUser[]>([])
  const [cursorPosition, setCursorPosition] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const debouncedMentionQuery = useDebounce(mentionQuery, 300)
  const { data: rawSuggestions } = useMentionableUsers(caseId, debouncedMentionQuery)

  // Filter out the current user from mention suggestions (cannot mention yourself)
  const mentionSuggestions = useMemo(
    () => rawSuggestions?.filter(user => user.id !== currentUserId),
    [rawSuggestions, currentUserId]
  )

  const extractMentionQuery = useCallback((text: string, cursor: number): string | null => {
    const beforeCursor = text.slice(0, cursor)
    const match = /@(\w*)$/.exec(beforeCursor)
    if (match) {
      return match[1] ?? ''
    }
    return null
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      if (newValue.length > COMMENT_MAX_LENGTH) return
      setBody(newValue)

      const cursor = e.target.selectionStart ?? 0
      setCursorPosition(cursor)

      const query = extractMentionQuery(newValue, cursor)
      if (query !== null && query.length >= 1) {
        setMentionQuery(query)
        setShowSuggestions(true)
      } else {
        setShowSuggestions(false)
        setMentionQuery('')
      }
    },
    [extractMentionQuery]
  )

  const handleSelectMention = useCallback(
    (user: MentionableUser) => {
      const beforeCursor = body.slice(0, cursorPosition)
      const afterCursor = body.slice(cursorPosition)

      const atIndex = beforeCursor.lastIndexOf('@')
      if (atIndex === -1) return

      const newBody = `${beforeCursor.slice(0, atIndex)}@${user.name} ${afterCursor}`
      setBody(newBody)
      setShowSuggestions(false)
      setMentionQuery('')

      if (
        !selectedMentions.some(m => m.id === user.id) &&
        selectedMentions.length < COMMENT_MENTIONS_MAX
      ) {
        setSelectedMentions(prev => [...prev, user])
      }

      // Refocus textarea
      setTimeout(() => {
        const newCursor = atIndex + user.name.length + 2
        textareaRef.current?.focus()
        textareaRef.current?.setSelectionRange(newCursor, newCursor)
      }, 0)
    },
    [body, cursorPosition, selectedMentions]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Escape' && showSuggestions) {
        setShowSuggestions(false)
        e.preventDefault()
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        const trimmed = body.trim()
        if (trimmed.length > 0 && !loading) {
          const mentionedUserIds = selectedMentions.map(m => m.id)
          onSubmit(trimmed, mentionedUserIds)
        }
      }
    },
    [showSuggestions, body, loading, selectedMentions, onSubmit]
  )

  const handleSubmit = useCallback(() => {
    const trimmed = body.trim()
    if (trimmed.length === 0) return

    const mentionedUserIds = selectedMentions.map(m => m.id)
    onSubmit(trimmed, mentionedUserIds)
  }, [body, selectedMentions, onSubmit])

  const isValid = body.trim().length > 0

  return (
    <div className="relative flex flex-col gap-2">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={body}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={t('placeholder')}
          className="min-h-[80px] resize-none pe-12"
          disabled={disabled ?? loading}
          maxLength={COMMENT_MAX_LENGTH}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute end-2 bottom-2 h-8 w-8"
          onClick={handleSubmit}
          disabled={disabled ?? loading ?? !isValid}
        >
          <Send className="h-4 w-4" />
        </Button>

        {showSuggestions && mentionSuggestions && mentionSuggestions.length > 0 && (
          <div className="bg-popover border-border absolute start-0 bottom-full z-50 mb-1 w-64 overflow-hidden rounded-md border shadow-md">
            <ul className="max-h-48 overflow-y-auto py-1">
              {mentionSuggestions.map(user => (
                <li key={user.id}>
                  <button
                    type="button"
                    className={cn(
                      'hover:bg-muted flex w-full items-center gap-2 px-3 py-2 text-start text-sm',
                      'focus:bg-muted outline-none'
                    )}
                    onMouseDown={e => {
                      e.preventDefault()
                      handleSelectMention(user)
                    }}
                  >
                    <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{user.name}</p>
                      <p className="text-muted-foreground truncate text-xs">{user.email}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs">{t('mentionHint')}</p>
        <p className="text-muted-foreground text-xs">
          {body.length}/{COMMENT_MAX_LENGTH}
        </p>
      </div>
    </div>
  )
}
