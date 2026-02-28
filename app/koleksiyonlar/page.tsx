export const revalidate = 300

import { KoleksiyonClient } from '@/src/components/KoleksiyonClient'
import { getContactNumbers, getProducts } from '@/src/lib/fetchers'

export default async function KoleksiyonPage() {
  const [products, contactNumbers] = await Promise.all([getProducts(), getContactNumbers()])

  return <KoleksiyonClient initialProducts={products} contactNumbers={contactNumbers} />
}
