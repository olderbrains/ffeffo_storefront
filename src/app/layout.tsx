import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Providers } from '@/components/providers';

import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Speffo - Premium Ecommerce Store',
    template: '%s | Speffo',
  },
  description: 'Shop premium products with fast delivery. Browse our wide collection of quality products at competitive prices.',
  keywords: ['ecommerce', 'online shopping', 'premium products', 'speffo'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Speffo',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="top-right" richColors theme="light" />
        </Providers>
      </body>
    </html>
  );
}
