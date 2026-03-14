'use client'

import {
  LayoutDashboard,
  Bell,
  Crosshair,
  Briefcase,
  Globe,
  Settings,
  Server,
  Search,
} from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { useCommandPalette } from '@/hooks'

const PAGE_ICONS = [LayoutDashboard, Bell, Crosshair, Briefcase, Globe, Settings, Server] as const

export function CommandPalette() {
  const { t, commandPaletteOpen, setCommandPaletteOpen, handleSelect, pages } = useCommandPalette()

  return (
    <CommandDialog
      open={commandPaletteOpen}
      onOpenChange={setCommandPaletteOpen}
      title={t('layout.commandPaletteTitle')}
      description={t('layout.commandPaletteDescription')}
    >
      <CommandInput placeholder={t('layout.searchPlaceholder')} />
      <CommandList>
        <CommandEmpty>{t('layout.noResults')}</CommandEmpty>
        <CommandGroup heading={t('layout.pages')}>
          {pages.map((page, index) => {
            const Icon = PAGE_ICONS[index]
            return (
              <CommandItem key={page.href} onSelect={() => handleSelect(page.href)}>
                {Icon ? <Icon className="h-4 w-4" /> : null}
                <span>{page.label}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={t('layout.actions')}>
          <CommandItem onSelect={() => handleSelect('/alerts')}>
            <Search className="h-4 w-4" />
            <span>{t('layout.searchAlerts')}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
