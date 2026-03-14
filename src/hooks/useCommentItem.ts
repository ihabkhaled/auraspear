import { useCallback, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CommentPartType } from '@/enums'
import { COMMENT_COLLAPSE_HEIGHT_PX } from '@/lib/constants/cases'
import type { CaseComment } from '@/types'

interface CommentPart {
  type: CommentPartType
  value: string
}

export function useCommentItem(comment: CaseComment) {
  const t = useTranslations('cases.comments')
  const [expanded, setExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const measureOverflow = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      contentRef.current = node
      setIsOverflowing(node.scrollHeight > COMMENT_COLLAPSE_HEIGHT_PX)
    }
  }, [])

  const toggleExpanded = () => {
    setExpanded(prev => !prev)
  }

  const parseMentions = useCallback((): CommentPart[] => {
    const { body, mentions } = comment

    if (mentions.length === 0) {
      return [{ type: CommentPartType.TEXT, value: body }]
    }

    const mentionNames = mentions.map(m => m.name)
    const escapedNames = mentionNames.map(name => name.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    const mentionRegex = new RegExp(`@(${escapedNames.join('|')})`, 'g')

    const parts: CommentPart[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null = mentionRegex.exec(body)

    while (match !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: CommentPartType.TEXT, value: body.slice(lastIndex, match.index) })
      }
      parts.push({ type: CommentPartType.MENTION, value: match[0] ?? '' })
      lastIndex = match.index + (match[0]?.length ?? 0)
      match = mentionRegex.exec(body)
    }

    if (lastIndex < body.length) {
      parts.push({ type: CommentPartType.TEXT, value: body.slice(lastIndex) })
    }

    return parts
  }, [comment])

  return {
    t,
    expanded,
    isOverflowing,
    measureOverflow,
    toggleExpanded,
    parseMentions,
  }
}
