import { describe, it, expect } from 'vitest'
import { UserRole } from '@/enums'
import { ROLE_HIERARCHY, hasRole, canAccessRoute, ROUTE_ROLE_MAP } from '@/lib/roles'

// ─── ROLE_HIERARCHY ──────────────────────────────────────────────

describe('ROLE_HIERARCHY', () => {
  it('should have GLOBAL_ADMIN at index 0 (most privileged)', () => {
    expect(ROLE_HIERARCHY[0]).toBe(UserRole.GLOBAL_ADMIN)
  })

  it('should have EXECUTIVE_READONLY at last index (least privileged)', () => {
    expect(ROLE_HIERARCHY[ROLE_HIERARCHY.length - 1]).toBe(UserRole.EXECUTIVE_READONLY)
  })

  it('should contain all UserRole enum values', () => {
    const allRoles = Object.values(UserRole)
    for (const role of allRoles) {
      expect(ROLE_HIERARCHY).toContain(role)
    }
  })

  it('should have no duplicate entries', () => {
    const unique = new Set(ROLE_HIERARCHY)
    expect(unique.size).toBe(ROLE_HIERARCHY.length)
  })

  it('should order TENANT_ADMIN above SOC_ANALYST_L2', () => {
    const adminIdx = ROLE_HIERARCHY.indexOf(UserRole.TENANT_ADMIN)
    const l2Idx = ROLE_HIERARCHY.indexOf(UserRole.SOC_ANALYST_L2)
    expect(adminIdx).toBeLessThan(l2Idx)
  })
})

// ─── hasRole ─────────────────────────────────────────────────────

describe('hasRole', () => {
  it('should return true when user role matches required role exactly', () => {
    expect(hasRole(UserRole.SOC_ANALYST_L1, UserRole.SOC_ANALYST_L1)).toBe(true)
  })

  it('should return true when user role is more privileged than required', () => {
    expect(hasRole(UserRole.GLOBAL_ADMIN, UserRole.SOC_ANALYST_L1)).toBe(true)
    expect(hasRole(UserRole.TENANT_ADMIN, UserRole.SOC_ANALYST_L2)).toBe(true)
    expect(hasRole(UserRole.GLOBAL_ADMIN, UserRole.EXECUTIVE_READONLY)).toBe(true)
  })

  it('should return false when user role is less privileged than required', () => {
    expect(hasRole(UserRole.SOC_ANALYST_L1, UserRole.TENANT_ADMIN)).toBe(false)
    expect(hasRole(UserRole.EXECUTIVE_READONLY, UserRole.SOC_ANALYST_L1)).toBe(false)
    expect(hasRole(UserRole.SOC_ANALYST_L2, UserRole.TENANT_ADMIN)).toBe(false)
  })

  it('should return false for unknown roles', () => {
    expect(hasRole('UNKNOWN_ROLE' as UserRole, UserRole.SOC_ANALYST_L1)).toBe(false)
    expect(hasRole(UserRole.SOC_ANALYST_L1, 'UNKNOWN_ROLE' as UserRole)).toBe(false)
  })

  it('GLOBAL_ADMIN should have access to every role level', () => {
    for (const role of ROLE_HIERARCHY) {
      expect(hasRole(UserRole.GLOBAL_ADMIN, role)).toBe(true)
    }
  })

  it('EXECUTIVE_READONLY should only have access to EXECUTIVE_READONLY', () => {
    expect(hasRole(UserRole.EXECUTIVE_READONLY, UserRole.EXECUTIVE_READONLY)).toBe(true)
    expect(hasRole(UserRole.EXECUTIVE_READONLY, UserRole.SOC_ANALYST_L1)).toBe(false)
    expect(hasRole(UserRole.EXECUTIVE_READONLY, UserRole.TENANT_ADMIN)).toBe(false)
  })
})

// ─── canAccessRoute ──────────────────────────────────────────────

describe('canAccessRoute', () => {
  describe('GLOBAL_ADMIN', () => {
    it('should access all routes', () => {
      const routes = Object.keys(ROUTE_ROLE_MAP)
      for (const route of routes) {
        expect(canAccessRoute(UserRole.GLOBAL_ADMIN, route)).toBe(true)
      }
    })
  })

  describe('EXECUTIVE_READONLY', () => {
    it('should access /dashboard', () => {
      expect(canAccessRoute(UserRole.EXECUTIVE_READONLY, '/dashboard')).toBe(true)
    })

    it('should access /profile', () => {
      expect(canAccessRoute(UserRole.EXECUTIVE_READONLY, '/profile')).toBe(true)
    })

    it('should access /settings', () => {
      expect(canAccessRoute(UserRole.EXECUTIVE_READONLY, '/settings')).toBe(true)
    })

    it('should NOT access /alerts', () => {
      expect(canAccessRoute(UserRole.EXECUTIVE_READONLY, '/alerts')).toBe(false)
    })

    it('should NOT access /cases', () => {
      expect(canAccessRoute(UserRole.EXECUTIVE_READONLY, '/cases')).toBe(false)
    })

    it('should NOT access /admin/tenant', () => {
      expect(canAccessRoute(UserRole.EXECUTIVE_READONLY, '/admin/tenant')).toBe(false)
    })

    it('should NOT access /admin/system', () => {
      expect(canAccessRoute(UserRole.EXECUTIVE_READONLY, '/admin/system')).toBe(false)
    })

    it('should NOT access /hunt', () => {
      expect(canAccessRoute(UserRole.EXECUTIVE_READONLY, '/hunt')).toBe(false)
    })
  })

  describe('SOC_ANALYST_L1', () => {
    it('should access /dashboard', () => {
      expect(canAccessRoute(UserRole.SOC_ANALYST_L1, '/dashboard')).toBe(true)
    })

    it('should access /alerts', () => {
      expect(canAccessRoute(UserRole.SOC_ANALYST_L1, '/alerts')).toBe(true)
    })

    it('should access /cases', () => {
      expect(canAccessRoute(UserRole.SOC_ANALYST_L1, '/cases')).toBe(true)
    })

    it('should NOT access /hunt', () => {
      expect(canAccessRoute(UserRole.SOC_ANALYST_L1, '/hunt')).toBe(false)
    })

    it('should NOT access /connectors', () => {
      expect(canAccessRoute(UserRole.SOC_ANALYST_L1, '/connectors')).toBe(false)
    })

    it('should NOT access /admin/tenant', () => {
      expect(canAccessRoute(UserRole.SOC_ANALYST_L1, '/admin/tenant')).toBe(false)
    })
  })

  describe('THREAT_HUNTER', () => {
    it('should access /hunt', () => {
      expect(canAccessRoute(UserRole.THREAT_HUNTER, '/hunt')).toBe(true)
    })

    it('should access /alerts (SOC_ANALYST_L1 level)', () => {
      expect(canAccessRoute(UserRole.THREAT_HUNTER, '/alerts')).toBe(true)
    })

    it('should NOT access /connectors (SOC_ANALYST_L2 level)', () => {
      expect(canAccessRoute(UserRole.THREAT_HUNTER, '/connectors')).toBe(false)
    })
  })

  describe('TENANT_ADMIN', () => {
    it('should access /admin/tenant', () => {
      expect(canAccessRoute(UserRole.TENANT_ADMIN, '/admin/tenant')).toBe(true)
    })

    it('should NOT access /admin/system', () => {
      expect(canAccessRoute(UserRole.TENANT_ADMIN, '/admin/system')).toBe(false)
    })
  })

  describe('sub-routes', () => {
    it('should match sub-routes via startsWith', () => {
      expect(canAccessRoute(UserRole.SOC_ANALYST_L1, '/alerts/123')).toBe(true)
      expect(canAccessRoute(UserRole.EXECUTIVE_READONLY, '/alerts/123')).toBe(false)
    })
  })

  describe('unlisted routes', () => {
    it('should allow access to routes not in ROUTE_ROLE_MAP', () => {
      expect(canAccessRoute(UserRole.EXECUTIVE_READONLY, '/unknown-route')).toBe(true)
    })
  })
})

// ─── Impersonation role hierarchy checks ─────────────────────────

describe('Impersonation role hierarchy (client-side)', () => {
  /**
   * Mirrors the check in TenantUserTable: callerIndex < targetIndex
   * (strictly more privileged) to determine if impersonate button shows.
   */
  function canImpersonate(callerRole: UserRole, targetRole: UserRole): boolean {
    const callerIndex = ROLE_HIERARCHY.indexOf(callerRole)
    const targetIndex = ROLE_HIERARCHY.indexOf(targetRole)
    if (callerIndex === -1 || targetIndex === -1) {
      return false
    }
    return callerIndex < targetIndex
  }

  it('GLOBAL_ADMIN can impersonate TENANT_ADMIN', () => {
    expect(canImpersonate(UserRole.GLOBAL_ADMIN, UserRole.TENANT_ADMIN)).toBe(true)
  })

  it('GLOBAL_ADMIN can impersonate SOC_ANALYST_L1', () => {
    expect(canImpersonate(UserRole.GLOBAL_ADMIN, UserRole.SOC_ANALYST_L1)).toBe(true)
  })

  it('GLOBAL_ADMIN can impersonate EXECUTIVE_READONLY', () => {
    expect(canImpersonate(UserRole.GLOBAL_ADMIN, UserRole.EXECUTIVE_READONLY)).toBe(true)
  })

  it('TENANT_ADMIN can impersonate SOC_ANALYST_L2', () => {
    expect(canImpersonate(UserRole.TENANT_ADMIN, UserRole.SOC_ANALYST_L2)).toBe(true)
  })

  it('TENANT_ADMIN cannot impersonate GLOBAL_ADMIN', () => {
    expect(canImpersonate(UserRole.TENANT_ADMIN, UserRole.GLOBAL_ADMIN)).toBe(false)
  })

  it('TENANT_ADMIN cannot impersonate another TENANT_ADMIN', () => {
    expect(canImpersonate(UserRole.TENANT_ADMIN, UserRole.TENANT_ADMIN)).toBe(false)
  })

  it('SOC_ANALYST_L1 cannot impersonate anyone above or at same level', () => {
    expect(canImpersonate(UserRole.SOC_ANALYST_L1, UserRole.GLOBAL_ADMIN)).toBe(false)
    expect(canImpersonate(UserRole.SOC_ANALYST_L1, UserRole.TENANT_ADMIN)).toBe(false)
    expect(canImpersonate(UserRole.SOC_ANALYST_L1, UserRole.SOC_ANALYST_L1)).toBe(false)
  })

  it('SOC_ANALYST_L1 can impersonate EXECUTIVE_READONLY', () => {
    expect(canImpersonate(UserRole.SOC_ANALYST_L1, UserRole.EXECUTIVE_READONLY)).toBe(true)
  })

  it('EXECUTIVE_READONLY cannot impersonate anyone', () => {
    for (const role of ROLE_HIERARCHY) {
      expect(canImpersonate(UserRole.EXECUTIVE_READONLY, role)).toBe(false)
    }
  })
})
