import { AuthGuard } from '@/components/common'
import { PortalShell } from '@/components/layout'

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthGuard>
      <PortalShell>{children}</PortalShell>
    </AuthGuard>
  )
}
