'use client'

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
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores'
import { BrandLogo } from './BrandLogo'
import { SidebarHealthFooter } from './SidebarHealthFooter'
import { SidebarNavItem } from './SidebarNavItem'

interface NavSection {
  label: string
  items: Array<{
    icon: typeof LayoutDashboard
    label: string
    href: string
    badge?: number
  }>
}

function SidebarContent({
  collapsed,
  onNavClick,
}: {
  collapsed: boolean
  onNavClick?: () => void
}) {
  const pathname = usePathname()
  const t = useTranslations()
  const { toggleSidebar } = useUIStore()

  const sections: NavSection[] = [
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
      items: [{ icon: Globe, label: t('nav.intel'), href: '/intel' }],
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

  return (
    <>
      <div
        className={cn(
          'border-sidebar-border flex items-center border-b p-4',
          collapsed ? 'justify-center' : 'justify-between'
        )}
      >
        <BrandLogo collapsed={collapsed} />
        {!collapsed && (
          <>
            {/* Desktop collapse button */}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={toggleSidebar}
              aria-label={t('layout.collapseSidebar')}
              className="hidden md:inline-flex"
            >
              <PanelLeftClose className="text-muted-foreground h-4 w-4" />
            </Button>
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onNavClick}
              aria-label={t('layout.closeSidebar')}
              className="md:hidden"
            >
              <X className="text-muted-foreground h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {collapsed && (
        <div className="flex justify-center py-3">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={toggleSidebar}
            aria-label={t('layout.expandSidebar')}
          >
            <PanelLeftOpen className="text-muted-foreground h-4 w-4" />
          </Button>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-6">
          {sections.map(section => (
            <div key={section.label}>
              {!collapsed && (
                <h3 className="text-muted-foreground mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
                  {section.label}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map(item => (
                  <SidebarNavItem
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    active={pathname.startsWith(item.href)}
                    badge={item.badge}
                    collapsed={collapsed}
                    onClick={onNavClick}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <SidebarHealthFooter collapsed={collapsed} />
    </>
  )
}

export function Sidebar() {
  const { sidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen } = useUIStore()

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'border-sidebar-border bg-sidebar hidden h-screen flex-col border-e transition-all duration-300 md:flex',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <SidebarContent collapsed={sidebarCollapsed} />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={cn(
          'bg-sidebar fixed inset-y-0 start-0 z-50 flex w-72 flex-col transition-transform duration-300 ease-in-out md:hidden',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'
        )}
      >
        <SidebarContent collapsed={false} onNavClick={() => setMobileSidebarOpen(false)} />
      </aside>
    </>
  )
}
