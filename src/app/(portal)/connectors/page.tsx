'use client'

import { RotateCcw, Plug } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common'
import { ConnectorCard, AuditLogViewer } from '@/components/connectors'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DEMO_TENANTS } from '@/lib/types/connectors'
import type { RBACRole } from '@/lib/types/connectors'
import { useConnectorsStore } from '@/stores/connectors.store'

const ROLES: RBACRole[] = ['Admin', 'SOC_Analyst', 'Viewer']

export default function ConnectorsPage() {
  const t = useTranslations('connectors')
  const connectorsByTenant = useConnectorsStore(s => s.connectorsByTenant)
  const activeTenantId = useConnectorsStore(s => s.activeTenantId)
  const role = useConnectorsStore(s => s.role)
  const setActiveTenant = useConnectorsStore(s => s.setActiveTenant)
  const setRole = useConnectorsStore(s => s.setRole)
  const seedDefaults = useConnectorsStore(s => s.seedDefaults)

  const connectors = connectorsByTenant[activeTenantId] ?? []

  const handleSeed = () => {
    seedDefaults()
    toast.success(t('demoDataRestored'))
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')}>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={activeTenantId} onValueChange={setActiveTenant}>
            <SelectTrigger size="sm" className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEMO_TENANTS.map(t => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={role} onValueChange={(v: RBACRole) => setRole(v)}>
            <SelectTrigger size="sm" className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map(r => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Badge variant="outline" className="text-xs">
            {role}
          </Badge>

          <Button variant="outline" size="sm" onClick={handleSeed}>
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            {t('seedDemoData')}
          </Button>
        </div>
      </PageHeader>

      {connectors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Plug className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="text-lg font-semibold">{t('noConnectors')}</h3>
          <p className="text-muted-foreground mt-1 text-sm">{t('noConnectorsDescription')}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {connectors.map(c => (
            <ConnectorCard key={c.id} connector={c} />
          ))}
        </div>
      )}

      <AuditLogViewer />
    </div>
  )
}
