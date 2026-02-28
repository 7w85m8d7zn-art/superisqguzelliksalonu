'use client'

import { motion } from 'framer-motion'
import { ContactNumbers } from '@/src/types'

interface StickyButtonsProps {
  contactNumbers?: ContactNumbers
}

export function StickyButtons({ contactNumbers }: StickyButtonsProps) {
  const whatsappNumber = (contactNumbers?.whatsapp_number || '').replace(/\D/g, '') || '905306249382'
  const whatsappMessage = encodeURIComponent(
    contactNumbers?.whatsapp_message || 'Merhaba, randevu almak istiyorum.'
  )

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+10rem)] right-[calc(env(safe-area-inset-right)+1.25rem)] z-50 flex flex-col gap-3 md:hidden">
      {/* WhatsApp Button */}
      <motion.a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
        title="WhatsApp'tan Sor"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.921 1.226-1.129 1.48-.215.255-.42.27-.715.09-.295-.189-1.243-.459-2.37-1.475-.874-.778-1.464-1.742-1.635-2.038-.16-.296-.017-.458.12-.606.123-.122.294-.314.442-.471.149-.157.198-.256.297-.416.1-.162.049-.305-.024-.429-.073-.123-.67-1.616-.92-2.206-.247-.609-.5-.52-.67-.529-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.634.803 5.11 2.323 7.177l-2.422 8.842 9.072-2.382a9.861 9.861 0 004.773 1.216h.005c5.396 0 9.747-4.363 9.747-9.798 0-2.640-.806-5.117-2.327-7.184-.529-.822-1.223-1.55-2.062-2.152-.838-.602-1.817-.972-2.8-1.069-.973-.093-1.951.023-2.868.326-.917.303-1.755.81-2.363 1.468-.608.658-1.014 1.438-1.178 2.27-.164.832-.057 1.719.311 2.472z" />
        </svg>
      </motion.a>
    </div>
  )
}
