'use client'

import { useEffect } from 'react'

export default function VisitorTracker() {
  useEffect(() => {
    // SessionStorage'da kontrol et (sayfa yenilemesinde tekrar saymaması için)
    const hasVisited = sessionStorage.getItem('visited')
    
    if (!hasVisited) {
      // İlk ziyaret - sayacı artır
      fetch('/api/settings', {
        method: 'PATCH',
      }).catch(err => console.error('Ziyaretçi sayacı hatası:', err))
      
      // İşaretle (sayfa yenilemesinde tekrar saymaması için)
      sessionStorage.setItem('visited', 'true')
    }
  }, [])

  return null // Bu component görsel bir şey render etmiyor
}
