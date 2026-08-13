import { AuthGuard, RoleGuard } from '@/components/common'
import { PortalShell } from '@/components/layout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false, noarchive: true, nocache: true },
}

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthGuard>
      <PortalShell>
        <RoleGuard>{children}</RoleGuard>
      </PortalShell>
    </AuthGuard>
  )
}
