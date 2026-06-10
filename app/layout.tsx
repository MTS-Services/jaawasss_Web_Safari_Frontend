import type { Metadata, Viewport } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import Script from "next/script"
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import { I18nProvider } from '@/lib/i18n'
import { Toaster } from '@/components/ui/toaster'
import { FavoritesProvider } from '@/lib/favorites-context'
import { SubscriptionProvider } from '@/lib/subscription-context'
import { OrdersProvider } from '@/lib/orders-context'
import { MessagesProvider } from '@/lib/messages-context'
import { RfqsProvider } from '@/lib/rfqs-context'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmSerif = DM_Serif_Display({ 
  subsets: ["latin"],
  weight: "400",
  variable: '--font-dm-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SourceNest - Discover Reviewed Manufacturers Worldwide',
    template: '%s | SourceNest'
  },
  description: 'Search products, compare suppliers, request quotes, and connect directly with trusted factories through one premium global sourcing platform.',
  keywords: ['B2B sourcing', 'manufacturers', 'suppliers', 'global trade', 'factory', 'wholesale', 'import', 'export'],
  authors: [{ name: 'SourceNest' }],
  openGraph: {
    title: 'SourceNest - Discover Reviewed Manufacturers Worldwide',
    description: 'Search products, compare suppliers, request quotes, and connect directly with trusted factories through one premium global sourcing platform.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#3d2e1f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body className="font-sans antialiased">
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
        <I18nProvider>
          <AuthProvider>
            <SubscriptionProvider>
              <FavoritesProvider>
                <RfqsProvider>
                  <OrdersProvider>
                    <MessagesProvider>
                      {children}
                    </MessagesProvider>
                  </OrdersProvider>
                </RfqsProvider>
              </FavoritesProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </I18nProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
