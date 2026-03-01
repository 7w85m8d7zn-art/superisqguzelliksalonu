'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'
import { Settings } from '@/src/types'

interface LayoutWrapperProps {
    children: React.ReactNode
    settings: Settings
}

export function LayoutWrapper({ children, settings }: LayoutWrapperProps) {
    const pathname = usePathname()
    const isAdminOrLogin = pathname?.startsWith('/admin') || pathname?.startsWith('/login')

    if (isAdminOrLogin) {
        return <>{children}</>
    }

    return (
        <div className="site-shell">
            <Header settings={settings} />
            <div className="pt-[84px]">
                {children}
            </div>
            <Footer settings={settings} />
        </div>
    )
}
