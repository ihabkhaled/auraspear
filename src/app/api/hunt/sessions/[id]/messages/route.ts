import { NextResponse } from 'next/server'
import { mockHuntSession } from '@/mocks/data/hunt.data'
import { HuntStatus, MessageRole, ReasoningStepStatus } from '@/enums'
import type { HuntSession, HuntMessage } from '@/types'

export const dynamic = 'force-dynamic'

const sessions: HuntSession[] = [mockHuntSession]

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = (await request.json()) as Record<string, unknown>
  const sessionIndex = sessions.findIndex(s => s.id === id)

  if (sessionIndex === -1) {
    return NextResponse.json(
      { error: 'Hunt session not found' },
      { status: 404 }
    )
  }

  const session = sessions[sessionIndex]
  if (!session) {
    return NextResponse.json(
      { error: 'Hunt session not found' },
      { status: 404 }
    )
  }

  const now = new Date().toISOString()
  const userMessage: HuntMessage = {
    id: `msg-${Date.now()}`,
    role: MessageRole.USER,
    content: body['content'] as string,
    timestamp: now,
  }

  const userContent = (body['content'] as string).toLowerCase()
  let aiContent =
    'I analyzed your query but did not find significant results. Try refining your search criteria or expanding the time range.'
  let eventsFound = 0
  let actions: string[] = ['Refine search', 'Expand time range']

  if (
    userContent.includes('brute force') ||
    userContent.includes('login') ||
    userContent.includes('authentication')
  ) {
    aiContent =
      'I found multiple brute force indicators in the authentication logs. There are 523 failed SSH attempts from 198.51.100.22 and 47 failed RDP attempts from 203.0.113.88 targeting dc-01. Three accounts were locked out. No successful compromises were detected from these external sources.'
    eventsFound = 15
    actions = ['View 15 related events', 'Create case from findings', 'Block source IPs']
  } else if (
    userContent.includes('malware') ||
    userContent.includes('ransomware') ||
    userContent.includes('trojan')
  ) {
    aiContent =
      'I detected malware-related activity across two hosts. File-server-02 shows mass file encryption consistent with LockBit 3.0, and mail-server has a trojan binary in the temp directory. Both incidents are actively being investigated in existing cases.'
    eventsFound = 8
    actions = ['View 8 related events', 'Link to existing cases', 'Run IOC sweep']
  } else if (
    userContent.includes('lateral') ||
    userContent.includes('movement') ||
    userContent.includes('psexec')
  ) {
    aiContent =
      'Lateral movement detected via PsExec from endpoint-42 to db-primary, and pass-the-hash authentication from proxy-east to dc-01. Endpoint-42 appears to be a pivot point for multiple suspicious activities including Kerberoasting and scheduled task creation.'
    eventsFound = 12
    actions = ['View 12 related events', 'Create case from findings', 'Isolate endpoint-42']
  } else if (
    userContent.includes('exfil') ||
    userContent.includes('dns') ||
    userContent.includes('tunnel')
  ) {
    aiContent =
      'I found DNS tunneling activity from workstation-17 with 340 TXT queries to data.exfil-cdn.net, and a 52MB upload from db-primary to mega.nz. The DNS tunneling is linked to active C2 beaconing. The cloud upload was confirmed as authorized backup activity.'
    eventsFound = 6
    actions = ['View 6 related events', 'Block exfiltration domains', 'Review DLP policy']
  }

  const aiMessage: HuntMessage = {
    id: `msg-${Date.now() + 1}`,
    role: MessageRole.AI,
    content: aiContent,
    timestamp: new Date(Date.now() + 1500).toISOString(),
    reasoningSteps: [
      {
        id: `rs-${Date.now()}-1`,
        label: 'Parsing query and identifying search parameters',
        status: ReasoningStepStatus.COMPLETED,
      },
      {
        id: `rs-${Date.now()}-2`,
        label: 'Querying relevant log sources',
        status: ReasoningStepStatus.COMPLETED,
      },
      {
        id: `rs-${Date.now()}-3`,
        label: 'Correlating events and enriching with context',
        status: ReasoningStepStatus.COMPLETED,
      },
      {
        id: `rs-${Date.now()}-4`,
        label: 'Generating findings summary',
        status: ReasoningStepStatus.COMPLETED,
      },
    ],
    actions,
  }

  const updatedSession: HuntSession = {
    ...session,
    status: HuntStatus.COMPLETED,
    messages: [...session.messages, userMessage, aiMessage],
    eventsFound: session.eventsFound + eventsFound,
  }

  sessions[sessionIndex] = updatedSession

  return NextResponse.json({ data: aiMessage })
}
