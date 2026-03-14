'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LoadingSpinner, Toast, SweetAlertDialog, SweetAlertIcon } from '@/components/common'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useCaseComments, useCreateCaseComment, useDeleteCaseComment } from '@/hooks'
import { getErrorKey } from '@/lib/api-error'
import type { CaseComment } from '@/types'
import { CommentComposer } from './CommentComposer'
import { CommentItem } from './CommentItem'

interface CaseCommentsProps {
  caseId: string
  currentUserId: string
  isAdmin: boolean
  isCaseClosed: boolean
}

export function CaseComments({ caseId, currentUserId, isAdmin, isCaseClosed }: CaseCommentsProps) {
  const t = useTranslations('cases.comments')
  const [expanded, setExpanded] = useState(true)
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCaseComments(caseId)

  const createComment = useCreateCaseComment(caseId)
  const deleteComment = useDeleteCaseComment(caseId)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [composerKey, setComposerKey] = useState(0)

  const allComments = useMemo<CaseComment[]>(
    () => data?.pages.flatMap(page => page.data) ?? [],
    [data?.pages]
  )
  const totalCount = data?.pages[0]?.pagination?.total ?? 0

  // Scroll to a specific comment when navigating via notification deep-link
  const hasScrolledToComment = useRef(false)
  useEffect(() => {
    if (hasScrolledToComment.current || allComments.length === 0) return
    const { hash } = window.location
    if (!hash.startsWith('#comment-')) return

    const element = document.querySelector(hash)
    if (element) {
      hasScrolledToComment.current = true
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.classList.add('bg-primary/10')
        setTimeout(() => {
          element.classList.remove('bg-primary/10')
        }, 3000)
      }, 100)
    }
  }, [allComments])

  // Infinite scroll via IntersectionObserver inside the scroll container
  const loadMoreRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const target = loadMoreRef.current
    const root = scrollContainerRef.current
    if (!target || !root) return

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { root, threshold: 0.1 }
    )

    observer.observe(target)
    return () => {
      observer.disconnect()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleSubmitComment = useCallback(
    (body: string, mentionedUserIds: string[]) => {
      createComment.mutate(
        { body, mentionedUserIds },
        {
          onSuccess: () => {
            setComposerKey(prev => prev + 1)
            Toast.success(t('commentAdded'))
          },
          onError: (error: unknown) => {
            Toast.error(t(getErrorKey(error)))
          },
        }
      )
    },
    [createComment, t]
  )

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      const confirmed = await SweetAlertDialog.show({
        text: t('confirmDelete'),
        icon: SweetAlertIcon.QUESTION,
      })
      if (!confirmed) return

      deleteComment.mutate(commentId, {
        onSuccess: () => {
          Toast.success(t('commentDeleted'))
        },
        onError: (error: unknown) => {
          Toast.error(t(getErrorKey(error)))
        },
      })
    },
    [deleteComment, t]
  )

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <div className="flex flex-col gap-4">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="hover:bg-muted/50 flex w-full cursor-pointer items-center gap-2 rounded-md py-1 transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            <h3 className="text-base font-semibold">{t('title')}</h3>
            {totalCount > 0 && <Badge variant="secondary">{totalCount}</Badge>}
            <span className="ms-auto">
              {expanded ? (
                <ChevronUp className="text-muted-foreground h-4 w-4" />
              ) : (
                <ChevronDown className="text-muted-foreground h-4 w-4" />
              )}
            </span>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="flex flex-col gap-4">
            {/* Comment composer — hidden when case is closed */}
            {!isCaseClosed && (
              <CommentComposer
                key={composerKey}
                caseId={caseId}
                currentUserId={currentUserId}
                onSubmit={handleSubmitComment}
                loading={createComment.isPending}
              />
            )}

            {/* Loading state */}
            {isLoading && (
              <div className="flex justify-center py-6">
                <LoadingSpinner />
              </div>
            )}

            {/* Error state */}
            {isError && (
              <p className="text-destructive py-4 text-center text-sm">{t('loadError')}</p>
            )}

            {/* Empty state */}
            {!isLoading && !isError && allComments.length === 0 && (
              <p className="text-muted-foreground py-6 text-center text-sm">{t('noComments')}</p>
            )}

            {/* Scrollable comments list */}
            {allComments.length > 0 && (
              <div
                ref={scrollContainerRef}
                className="divide-border max-h-[400px] divide-y overflow-y-auto"
              >
                {allComments.map(comment => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    currentUserId={currentUserId}
                    isAdmin={isAdmin}
                    onDelete={handleDeleteComment}
                  />
                ))}

                {/* Load more trigger for infinite scroll */}
                <div ref={loadMoreRef} className="h-1" />

                {/* Loading more indicator */}
                {isFetchingNextPage && (
                  <div className="flex justify-center py-2">
                    <LoadingSpinner />
                  </div>
                )}

                {/* End of list */}
                {!hasNextPage && (
                  <p className="text-muted-foreground py-2 text-center text-xs">
                    {t('endOfComments')}
                  </p>
                )}
              </div>
            )}

            {/* Manual load more button as fallback */}
            {hasNextPage && !isFetchingNextPage && (
              <Button
                variant="outline"
                size="sm"
                className="self-center"
                onClick={() => void fetchNextPage()}
              >
                {t('loadMore')}
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
