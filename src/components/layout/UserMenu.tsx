'use client'

import { useRouter } from 'next/navigation'
import { User, Settings, LogOut } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores'
import { getInitials } from '@/lib/case.utils'
import { LanguageSwitcher } from './LanguageSwitcher'
import { TenantSwitcher } from './TenantSwitcher'
import { ThemeSwitcher } from './ThemeSwitcher'

export function UserMenu() {
  const t = useTranslations('layout')
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const displayName = user?.email?.split('@')[0] ?? t('socAnalyst')
  const displayEmail = user?.email ?? ''
  const initials = displayName ? getInitials(displayName) : 'U'

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="focus-visible:ring-ring flex items-center gap-2 rounded-full outline-none focus-visible:ring-2"
        >
          <Avatar size="sm">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{displayName}</span>
            <span className="text-muted-foreground text-xs">{displayEmail}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Mobile-only: settings hidden from topbar on small screens */}
        <div className="space-y-2 p-2 md:hidden">
          <LanguageSwitcher />
          <TenantSwitcher />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">{t('theme')}</span>
            <ThemeSwitcher />
          </div>
        </div>
        <DropdownMenuSeparator className="md:hidden" />

        <DropdownMenuItem>
          <User className="h-4 w-4" />
          {t('profile')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="h-4 w-4" />
          {t('settings')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          {t('signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
