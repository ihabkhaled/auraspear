'use client'

import { MessageSquare, BarChart3 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { HuntChatPanel, HuntResultsPanel } from '@/components/hunt'
import { Button } from '@/components/ui/button'
import { HuntStatus } from '@/enums'
import { useHuntPage } from '@/hooks/useHuntPage'

export default function HuntPage() {
  const t = useTranslations('hunt')
  const {
    mobileTab,
    setMobileTab,
    messages,
    huntStatus,
    huntId,
    events,
    uniqueIps,
    threatScore,
    eventsLoading,
    isSending,
    handleSend,
  } = useHuntPage()

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
