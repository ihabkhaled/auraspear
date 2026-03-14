import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export function useAddConnectorCard() {
  const router = useRouter()
  const t = useTranslations('connectors')

  return { router, t }
}
