"use client"

import React, { useState } from 'react'
import Link from 'next/link'

interface ProductCardProps {
  id: string
  title: string
  price: string
  img?: string
  onDelete?: (id: string) => void
}

export default function ProductCard({ id, title, price, img, onDelete }: ProductCardProps) {
  const [hasError, setHasError] = useState(false)
  const imageSrc = img?.trim() || ''

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="w-full h-44 bg-gray-100 flex items-center justify-center">
        {!imageSrc || hasError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300"> 
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 15l-5-5-2 2-4-4-5 5" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ) : (
          <img src={imageSrc} alt={title} className="object-cover w-full h-full" onError={() => setHasError(true)} />
        )}
      </div>
      <div className="p-3">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-gray-500 mt-1">{price}</div>
        <div className="mt-3 flex gap-2">
          <Link href={`/admin/products/${id}/edit`} className="text-sm px-3 py-1 border rounded hover:bg-gray-50">Düzenle</Link>
          {onDelete && (
            <button 
              type="button"
              onClick={() => onDelete(id)} 
              className="admin-btn-danger text-sm px-3 py-1 rounded transition-colors"
              style={{ backgroundColor: '#dc2626', color: '#ffffff', borderColor: '#b91c1c' }}
            >
              Sil
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
