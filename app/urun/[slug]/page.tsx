export const revalidate = 300

import { notFound } from 'next/navigation'
import { ProductDetailClient } from '@/src/components/ProductDetailClient'
import { getContactNumbers, getProducts } from '@/src/lib/fetchers'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const [products, contactNumbers] = await Promise.all([getProducts(), getContactNumbers()])

  const product = products.find((p) => p.slug === slug || p.id === slug)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} allProducts={products} contactNumbers={contactNumbers} />
}
