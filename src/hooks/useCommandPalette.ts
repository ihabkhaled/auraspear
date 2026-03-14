'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useUIStore } from '@/stores'

export function useCommandPalette() {
  const t = useTranslations()
  const router = useRouter()
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [commandPaletteOpen, setCommandPaletteOpen])

  function handleSelect(href: string) {
    setCommandPaletteOpen(false)
    router.push(href)
  }

  const pages = [
    { label: t('nav.dashboard'), href: '/dashboard' },
    { label: t('nav.alerts'), href: '/alerts' },
    { label: t('nav.hunt'), href: '/hunt' },
    { label: t('nav.cases'), href: '/cases' },
    { label: t('nav.intel'), href: '/intel' },
    { label: t('nav.tenantConfig'), href: '/admin/tenant' },
    { label: t('nav.systemAdmin'), href: '/admin/system' },
  ]

  return {
    t,
    commandPaletteOpen,
    setCommandPaletteOpen,
    handleSelect,
    pages,
  }
}
