"use client"
import React, { useState } from 'react'
import ImageUploader from './ImageUploader'
import { useRouter } from 'next/navigation'

export default function ProductForm() {
  const [title, setTitle] = useState('')
  const [priceFrom, setPriceFrom] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [colors, setColors] = useState('')
  const [sizes, setSizes] = useState('')
  const [featured, setFeatured] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const router = useRouter()

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input name="title" value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full border p-2 rounded" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Price From</label>
          <input name="priceFrom" value={priceFrom} onChange={(e)=>setPriceFrom(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Featured</label>
          <input type="checkbox" name="featured" checked={featured} onChange={(e)=>setFeatured(e.target.checked)} className="mt-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea name="description" value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full border p-2 rounded" rows={4} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma)</label>
          <input name="tags" value={tags} onChange={(e)=>setTags(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Colors (comma)</label>
          <input name="colors" value={colors} onChange={(e)=>setColors(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sizes (comma)</label>
          <input name="sizes" value={sizes} onChange={(e)=>setSizes(e.target.value)} className="w-full border p-2 rounded" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Images</label>
        <ImageUploader inputName="images" onPreviews={(p)=>setImages(p)} />
      </div>

      <div className="flex justify-end">
        <button onClick={async ()=>{
          const payload = {
            title,
            price_from: parseFloat(priceFrom) || 0,
            description,
            tags: tags.split(',').map(t=>t.trim()).filter(Boolean),
            colors: colors.split(',').map(t=>t.trim()).filter(Boolean),
            sizes: sizes.split(',').map(t=>t.trim()).filter(Boolean),
            featured,
            images,
          }

          const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

          if (res.ok) {
            router.push('/admin/products')
          } else {
            alert('Model kaydı sırasında hata oluştu')
          }
        }} className="bg-black text-white px-4 py-2 rounded">Kaydet</button>
      </div>

      {/* SEO handled in background by the team; inputs removed */}
    </div>
  )
}
