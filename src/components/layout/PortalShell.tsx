'use client'

import type { ReactNode } from 'react'
import { LoadingSpinner } from '@/components/common'
import { usePreferencesSync } from '@/hooks/usePreferencesSync'
import { CommandPalette } from './CommandPalette'
import { ImpersonationBanner } from './ImpersonationBanner'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface PortalShellProps {
  children: ReactNode
}

export function PortalShell({ children }: PortalShellProps) {
  const { syncing } = usePreferencesSync()

  if (syncing) {
    return (
      <div className="bg-background flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <ImpersonationBanner />
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
      <CommandPalette />
    </div>
  )
}
