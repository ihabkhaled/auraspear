import api from '@/lib/api'
import { extractApiData } from '@/lib/utils'
import type { ContactFormValues, ContactResponse } from '@/types'

export const contactService = {
  send: (values: ContactFormValues) =>
    api.post('/contact', values).then(r => extractApiData<ContactResponse>(r)),
}
