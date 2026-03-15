import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Bell,
  Crosshair,
  Briefcase,
  Globe,
  Settings,
  Server,
  Plug,
  Compass,
  ShieldAlert,
  GitBranch,
  Bug,
  Activity,
  Bot,
  FileCheck,
  BarChart3,
  Brain,
  Route,
  Workflow,
  Layers,
  ShieldCheck,
  Cloud,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { UserRole } from '@/enums'
import { useSidebarHealth } from '@/hooks/useSidebarHealth'
import { canAccessRoute } from '@/lib/roles'
import { useUIStore, useAuthStore } from '@/stores'
import type { NavSection } from '@/types'

export function useSidebarContent() {
  const pathname = usePathname()
  const t = useTranslations()
  const { toggleSidebar } = useUIStore()
  const { user } = useAuthStore()
  const userRole = user?.role as UserRole | undefined
  const { healthPercent, servicesOnline, totalServices, maxLatencyMs } = useSidebarHealth()

  const allSections: NavSection[] = [
    {
      label: t('nav.overview'),
      items: [
        { icon: LayoutDashboard, label: t('nav.dashboard'), href: '/dashboard' },
        { icon: Bell, label: t('nav.alerts'), href: '/alerts' },
        { icon: ShieldAlert, label: t('nav.incidents'), href: '/incidents' },
      ],
    },
    {
      label: t('nav.detectionAnalysis'),
      items: [
        { icon: GitBranch, label: t('nav.correlation'), href: '/correlation' },
        { icon: Crosshair, label: t('nav.hunt'), href: '/hunt' },
        { icon: Bug, label: t('nav.vulnerabilities'), href: '/vulnerabilities' },
        { icon: Brain, label: t('nav.ueba'), href: '/ueba' },
        { icon: Route, label: t('nav.attackPath'), href: '/attack-paths' },
        { icon: Layers, label: t('nav.normalization'), href: '/normalization' },
        { icon: ShieldCheck, label: t('nav.rulesEngine'), href: '/detection-rules' },
      ],
    },
    {
      label: t('nav.intelligenceResponse'),
      items: [
        { icon: Globe, label: t('nav.intel'), href: '/intel' },
        { icon: Briefcase, label: t('nav.cases'), href: '/cases' },
        { icon: Compass, label: t('nav.explorer'), href: '/explorer' },
      ],
    },
    {
      label: t('nav.infrastructure'),
      items: [
        { icon: Plug, label: t('nav.connectors'), href: '/connectors' },
        { icon: Activity, label: t('nav.systemHealth'), href: '/system-health' },
        { icon: Cloud, label: t('nav.cloudSecurity'), href: '/cloud-security' },
      ],
    },
    {
      label: t('nav.aiAutomation'),
      items: [
        { icon: Bot, label: t('nav.aiAgents'), href: '/ai-agents' },
        { icon: Workflow, label: t('nav.soar'), href: '/soar' },
      ],
    },
    {
      label: t('nav.governance'),
      items: [
        { icon: FileCheck, label: t('nav.compliance'), href: '/compliance' },
        { icon: BarChart3, label: t('nav.reports'), href: '/reports' },
        { icon: Settings, label: t('nav.tenantConfig'), href: '/admin/tenant' },
        { icon: Server, label: t('nav.systemAdmin'), href: '/admin/system' },
      ],
    },
  ]

  // Filter sections and items based on user role
  const sections = userRole
    ? allSections
        .map(section => ({
          ...section,
          items: section.items.filter(item => canAccessRoute(userRole, item.href)),
        }))
        .filter(section => section.items.length > 0)
    : allSections

  return {
    pathname,
    t,
    toggleSidebar,
    sections,
    healthPercent,
    servicesOnline,
    totalServices,
    maxLatencyMs,
  }
}

export function useSidebarShell() {
  const { sidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen } = useUIStore()

  return { sidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen }
}
