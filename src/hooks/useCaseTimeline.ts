import { useState } from 'react'
import { useTranslations } from 'next-intl'

export function useCaseTimeline() {
  const t = useTranslations('cases')
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => {
    setExpanded(prev => !prev)
  }

  return { t, expanded, toggleExpanded }
}
