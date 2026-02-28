export interface Product {
  id: string
  slug: string
  name: string
  category: 'kiralama' | 'ozel-dikim'
  priceFrom: number
  images: string[]
  colors: string[]
  sizes: string[]
  tags: string[]
  description: string
  featured?: boolean
}

export const products: Product[] = [



]
