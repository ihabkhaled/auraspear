import type { MarketingPage } from '@/types/marketing.types'

function page(path: string, title: string, description: string, category: string): MarketingPage {
  return {
    path,
    title,
    description,
    category,
    capabilities: [
      `Centralized ${title.toLowerCase()} workflows`,
      'Tenant-aware access controls and auditability',
      'Automation, evidence, and analyst context in one workspace',
      'Open integration paths for existing security operations stacks',
    ],
  }
}

export const MARKETING_PAGES: readonly MarketingPage[] = [
  page(
    '/',
    'AI-powered security operations',
    'Unify detection, investigation, intelligence, and response in one multi-tenant SOC platform.',
    'Overview'
  ),
  page(
    '/about',
    'About AuraSpear',
    'Meet the mission and engineering principles behind AuraSpear SOC.',
    'Company'
  ),
  page(
    '/contact',
    'Request a demo',
    'Talk with the AuraSpear team about deployment, integrations, and security operations.',
    'Company'
  ),
  page(
    '/platform/overview',
    'Unified SOC platform',
    'A single operational layer for signals, evidence, decisions, and response.',
    'Platform'
  ),
  page(
    '/platform/architecture',
    'Security operations architecture',
    'Understand AuraSpear’s modular data, automation, AI, and governance layers.',
    'Platform'
  ),
  page(
    '/platform/multi-tenant-soc',
    'Multi-tenant SOC operations',
    'Operate multiple security programs from an isolated, governed control plane.',
    'Platform'
  ),
  page(
    '/platform/security',
    'Platform security',
    'Defense-in-depth controls for identity, permissions, data, and AI-assisted actions.',
    'Platform'
  ),
  page(
    '/platform/tenant-isolation',
    'Tenant isolation',
    'Keep tenant identities, telemetry, cases, configurations, and access boundaries separated.',
    'Platform'
  ),
  ...(
    [
      ['dashboards', 'SOC dashboards'],
      ['alert-management', 'Alert management'],
      ['incident-management', 'Incident management'],
      ['case-management', 'Case management'],
      ['case-cycles', 'Case lifecycle orchestration'],
      ['reporting', 'Security reporting'],
      ['notifications', 'Operational notifications'],
      ['jobs', 'Background jobs'],
      ['system-health', 'System health'],
      ['detection-rules', 'Detection engineering'],
      ['correlation-engine', 'Correlation engine'],
      ['threat-hunting', 'Threat hunting'],
      ['threat-intelligence', 'Threat intelligence'],
      ['entities-risk', 'Entity risk'],
      ['vulnerabilities', 'Vulnerability management'],
      ['ueba', 'User and entity behavior analytics'],
      ['cloud-security', 'Cloud security'],
      ['compliance', 'Compliance operations'],
      ['attack-paths', 'Attack path analysis'],
      ['soar', 'SOAR automation'],
      ['ai-co-analyst', 'AI co-analyst'],
      ['ai-agents', 'AI agents'],
      ['ai-chat', 'AI investigation chat'],
      ['ai-search', 'AI search'],
      ['ai-findings', 'AI findings'],
      ['ai-memory-rag', 'AI memory and RAG'],
      ['ai-evaluation', 'AI evaluation'],
      ['ai-simulations', 'AI simulations'],
      ['ai-governance', 'AI governance'],
      ['ai-finops', 'AI FinOps'],
      ['data-explorer', 'Security data explorer'],
      ['normalization', 'Normalization pipelines'],
    ] as const
  ).map(([slug, title]) =>
    page(
      `/features/${slug}`,
      title,
      `Explore how AuraSpear delivers ${title.toLowerCase()} with governed workflows and connected evidence.`,
      'Features'
    )
  ),
  ...(
    [
      ['overview', 'Security integrations'],
      ['wazuh', 'Wazuh'],
      ['logstash', 'Logstash'],
      ['graylog', 'Graylog'],
      ['grafana', 'Grafana'],
      ['misp', 'MISP'],
      ['shuffle', 'Shuffle'],
      ['velociraptor', 'Velociraptor'],
      ['influxdb', 'InfluxDB'],
      ['llm-providers', 'LLM providers'],
    ] as const
  ).map(([slug, title]) =>
    page(
      `/integrations/${slug}`,
      `${title} integration`,
      `Connect ${title} to AuraSpear for unified security context and operations.`,
      'Integrations'
    )
  ),
]

export const MARKETING_GROUPS = ['Platform', 'Features', 'Integrations', 'Company'] as const
