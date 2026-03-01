import { NextResponse } from 'next/server'
import { mockHuntSession } from '@/mocks/data/hunt.data'
import { HuntStatus, MessageRole } from '@/enums'
import type { HuntSession } from '@/types'

export const dynamic = 'force-dynamic'

const sessions: HuntSession[] = [mockHuntSession]

export async function POST() {
  const now = new Date().toISOString()
  const newSession: HuntSession = {
    id: `hunt-session-${String(sessions.length + 1).padStart(3, '0')}`,
    status: HuntStatus.IDLE,
    createdAt: now,
    messages: [
      {
        id: `msg-${Date.now()}`,
        role: MessageRole.SYSTEM,
        content:
          'Welcome to AI Threat Hunt. I can help you investigate threats across your environment. Describe what you are looking for, and I will query logs, correlate events, and surface findings.',
        timestamp: now,
      },
    ],
    eventsFound: 0,
  }

  sessions.push(newSession)

  return NextResponse.json({ data: newSession }, { status: 201 })
}
