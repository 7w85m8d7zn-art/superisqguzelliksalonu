export const revalidate = 300

import { ContactClient } from '@/src/components/ContactClient'
import { getContactData, getContactNumbers } from '@/src/lib/fetchers'

export default async function ContactPage() {
  const [contactData, contactNumbers] = await Promise.all([getContactData(), getContactNumbers()])

  return <ContactClient settings={contactData} contactNumbers={contactNumbers} />
}
