
import type { Metadata } from 'next'
import React from 'react'
import Footer from '@/components/ui/Footer'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import '../globals.css'
import { Toaster } from 'sonner'
import { SidebarComponent } from '@/components/ui/test/Sidebar'
import HeroHeader from '@/components/heroSection/HeroHeader'


export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  return (
      <div className='no-scrollbar h-screen' >
        <div
          className=
            "flex flex-col lg:flex-row w-full flex-1 h-full"
        >

          <SidebarComponent/>
          <Providers>
            <div className="flex-1 h-screen flex flex-col overflow-y-auto whitespace-nowrap">

            <HeroHeader />
              <main className="px-4">
                {children}
              </main>
              <Footer />
            </div>
          </Providers>

          <Toaster position="top-center" richColors />
        </div>
      </div>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://payloadcms.com'),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
