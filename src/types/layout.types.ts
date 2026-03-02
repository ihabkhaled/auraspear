import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  icon: LucideIcon
  label: string
  href: string
  badge?: number
}

export interface NavSection {
  label: string
  items: NavItem[]
}
