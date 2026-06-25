import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { Toaster } from 'sonner';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Providers } from '@/components/providers';

import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: {
    default: 'Speffo — Designed for Detours',
    template: '%s | Speffo',
  },
  description:
    'Considered, durable goods made for every kind of trip — from the weekend watering hole to a new city. Shop the latest arrivals at Speffo.',
  keywords: ['sustainable', 'apparel', 'online shopping', 'considered design', 'speffo'],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Speffo',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'Speffo' }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${fraunces.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="top-center" richColors theme="light" />
        </Providers>
      </body>
    </html>
  );
}
