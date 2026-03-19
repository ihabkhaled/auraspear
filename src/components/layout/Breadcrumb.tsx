'use client'

import React from 'react'
import Link from 'next/link'
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useBreadcrumb } from '@/hooks/useBreadcrumb'

const pathLabelMap: Record<string, string> = {
  dashboard: 'nav.dashboard',
  alerts: 'nav.alerts',
  hunt: 'nav.hunt',
  cases: 'nav.cases',
  intel: 'nav.intel',
  tenant: 'nav.tenantConfig',
  system: 'nav.systemAdmin',
  'role-settings': 'nav.roleSettings',
  notifications: 'nav.notifications',
  connectors: 'nav.connectors',
  profile: 'nav.profile',
  settings: 'nav.settings',
  incidents: 'nav.incidents',
  jobs: 'nav.jobs',
  correlation: 'nav.correlation',
  explorer: 'nav.explorer',
  vulnerabilities: 'nav.vulnerabilities',
  'system-health': 'nav.systemHealth',
  'ai-agents': 'nav.aiAgents',
  compliance: 'nav.compliance',
  reports: 'nav.reports',
  'attack-paths': 'nav.attackPath',
  ueba: 'nav.ueba',
  soar: 'nav.soar',
  normalization: 'nav.normalization',
  'detection-rules': 'nav.rulesEngine',
  'cloud-security': 'nav.cloudSecurity',
}

/** Segments that are route groups only — no standalone page, skip in breadcrumbs */
const SKIP_SEGMENTS = new Set(['admin'])

export function LayoutBreadcrumb() {
  const { segments, t } = useBreadcrumb()

  if (segments.length === 0) {
    return null
  }

  return (
    <BreadcrumbRoot>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">{t('layout.home')}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments
          .filter(segment => !SKIP_SEGMENTS.has(segment))
          .map((segment, index, filtered) => {
            const href = `/${segments.slice(0, segments.indexOf(segment) + 1).join('/')}`
            const isLast = index === filtered.length - 1
            const labelKey = Reflect.get(pathLabelMap, segment) as string | undefined
            const label = labelKey ? t(labelKey) : segment

            return (
              <React.Fragment key={href}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={href}>{label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            )
          })}
      </BreadcrumbList>
    </BreadcrumbRoot>
  )
}
