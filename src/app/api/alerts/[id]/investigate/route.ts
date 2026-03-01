import { NextResponse } from 'next/server'
import { mockAlerts } from '@/mocks/data/alerts.data'

export const dynamic = 'force-dynamic'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const alert = mockAlerts.find(a => a.id === id)

  if (!alert) {
    return NextResponse.json(
      { error: 'Alert not found' },
      { status: 404 }
    )
  }

  const investigation = {
    alertId: alert.id,
    verdict: alert.severity === 'critical' ? 'True Positive' : 'Likely True Positive',
    confidence: alert.severity === 'critical' ? 92 : 78,
    reasoning: `Analysis of alert "${alert.ruleName}" on ${alert.agentName}: The observed activity from ${alert.sourceIp} to ${alert.destinationIp} matches known attack patterns for ${alert.mitreTechniques.join(', ')}. The timing, frequency, and payload characteristics are consistent with genuine threat activity rather than benign operations. Cross-referencing with threat intelligence feeds shows correlation with recently reported campaigns.`,
    recommendations: [
      `Isolate ${alert.agentName} from the network pending further investigation`,
      `Block source IP ${alert.sourceIp} at the perimeter firewall`,
      'Review logs from adjacent systems for signs of lateral movement',
      'Update detection rules to catch similar patterns with lower latency',
      'Escalate to incident response team if not already engaged',
    ],
    relatedAlerts: mockAlerts
      .filter(
        a =>
          a.id !== alert.id &&
          (a.agentName === alert.agentName || a.sourceIp === alert.sourceIp)
      )
      .slice(0, 3)
      .map(a => a.id),
    mitreTechniques: alert.mitreTechniques,
  }

  return NextResponse.json({ data: investigation })
}
