'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(formData: FormData) {
  try {
    const title = formData.get('title')?.toString() || ''
    // TODO: store files and product data in DB/storage
    console.log('Creating product:', title)
    // Example: revalidatePath('/admin/products')
    revalidatePath('/admin/products')
    // After creation, redirect back to products list
    redirect('/admin/products')
  } catch (err) {
    console.error(err)
    redirect('/admin/products')
  }
}
