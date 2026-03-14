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
      label: t('nav.main'),
      items: [
        { icon: LayoutDashboard, label: t('nav.dashboard'), href: '/dashboard' },
        { icon: Bell, label: t('nav.alerts'), href: '/alerts' },
        { icon: Crosshair, label: t('nav.hunt'), href: '/hunt' },
        { icon: Briefcase, label: t('nav.cases'), href: '/cases' },
      ],
    },
    {
      label: t('nav.intelligence'),
      items: [
        { icon: Globe, label: t('nav.intel'), href: '/intel' },
        { icon: Compass, label: t('nav.explorer'), href: '/explorer' },
      ],
    },
    {
      label: t('nav.system'),
      items: [
        { icon: Plug, label: t('nav.connectors'), href: '/connectors' },
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
