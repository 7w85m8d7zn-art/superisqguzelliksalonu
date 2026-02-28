export const revalidate = 300

import { AboutClient } from '@/src/components/AboutClient'
import { getAboutData, getContactNumbers } from '@/src/lib/fetchers'

export default async function AboutPage() {
  const [aboutData, contactNumbers] = await Promise.all([getAboutData(), getContactNumbers()])
  return <AboutClient about={aboutData} contactNumbers={contactNumbers} />
}
