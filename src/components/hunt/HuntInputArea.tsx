'use client'

import { useState, useCallback } from 'react'
import { Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { QUICK_PROMPT_KEYS } from '@/lib/constants/hunt'

interface HuntInputAreaProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function HuntInputArea({ onSend, disabled = false }: HuntInputAreaProps) {
  const t = useTranslations('hunt')
  const [value, setValue] = useState('')

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (trimmed.length === 0) return
    onSend(trimmed)
    setValue('')
  }, [value, onSend])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const handleQuickPrompt = useCallback(
    (key: (typeof QUICK_PROMPT_KEYS)[number]) => {
      const prompt = t(`quickPrompts.${key}`)
      onSend(prompt)
    },
    [onSend, t]
  )

  return (
    <div className="border-border bg-card/50 flex flex-col gap-3 border-t p-4">
      <div className="flex gap-2">
        <Textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('inputPlaceholder')}
          disabled={disabled}
          className="max-h-32 min-h-10 resize-none"
        />
        <Button
          onClick={handleSend}
          disabled={disabled || value.trim().length === 0}
          className="shrink-0 shadow-[0_0_12px_hsl(var(--primary)/0.4)] transition-shadow hover:shadow-[0_0_20px_hsl(var(--primary)/0.6)]"
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {QUICK_PROMPT_KEYS.map(key => (
          <button
            key={key}
            type="button"
            onClick={() => handleQuickPrompt(key)}
            disabled={disabled}
            className="border-border bg-muted/50 text-muted-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-foreground rounded-full border px-3 py-1 text-xs transition-colors disabled:pointer-events-none disabled:opacity-50"
          >
            {t(`quickPrompts.${key}`)}
          </button>
        ))}
      </div>
    </div>
  )
}
