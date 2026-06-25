'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { SearchOverlay } from '@/components/search/search-overlay';
import { selectCartCount, useCartStore } from '@/lib/stores/cart-store';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'New In', href: '/search?sort=newest' },
  { name: 'Shop', href: '/categories' },
  { name: 'Brands', href: '/brands' },
  { name: 'Sale', href: '/search?sale=true' },
];

const announcements = [
  'Complimentary shipping on orders over ₹2,000',
  'Designed for Detours — built to last, made to wander',
  '30-day easy returns on every order',
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCartStore(selectCartCount);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Announcement marquee */}
        <div className="bg-forest text-sand overflow-hidden">
          <div className="container py-2">
            <div className="flex items-center justify-center gap-16 overflow-hidden whitespace-nowrap">
              <div className="flex shrink-0 items-center gap-16 animate-marquee">
                {[...announcements, ...announcements].map((line, i) => (
                  <span
                    key={i}
                    className="text-[11px] uppercase tracking-[0.22em] text-sand/90"
                  >
                    {line}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div
          className={cn(
            'border-b transition-all duration-300',
            scrolled
              ? 'border-border bg-[hsl(38_36%_94%/0.9)] backdrop-blur-md shadow-[0_1px_20px_rgba(0,0,0,0.04)]'
              : 'border-transparent bg-background',
          )}
        >
          <div className="container">
            <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center">
              {/* Left: nav (desktop) / menu (mobile) */}
              <div className="flex items-center">
                <button
                  className="lg:hidden cursor-pointer -ml-1 p-1 text-foreground/70 hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>

                <nav className="hidden lg:flex lg:items-center lg:gap-7">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="link-underline cursor-pointer text-[13px] font-medium uppercase tracking-[0.12em] text-foreground/75 transition-colors hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Center: wordmark */}
              <Link
                href="/"
                className="cursor-pointer select-none text-center flex items-center justify-center"
                aria-label="Speffo home"
              >
                <Image
                  src="/logo.png"
                  alt="Speffo"
                  width={100}
                  height={36}
                  className="h-8 w-auto object-contain"
                  priority
                />
              </Link>

              {/* Right: actions */}
              <div className="flex items-center justify-end gap-0.5">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-black/[0.04] hover:text-foreground"
                  aria-label="Search"
                >
                  <Search className="h-[19px] w-[19px]" strokeWidth={1.6} />
                </button>
                <Link
                  href="/account/wishlist"
                  className="cursor-pointer hidden h-9 w-9 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-black/[0.04] hover:text-foreground sm:flex"
                  aria-label="Wishlist"
                >
                  <Heart className="h-[19px] w-[19px]" strokeWidth={1.6} />
                </Link>
                <Link
                  href="/account"
                  className="cursor-pointer hidden h-9 w-9 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-black/[0.04] hover:text-foreground sm:flex"
                  aria-label="Account"
                >
                  <User className="h-[19px] w-[19px]" strokeWidth={1.6} />
                </Link>
                <Link
                  href="/cart"
                  className="cursor-pointer relative flex h-9 w-9 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-black/[0.04] hover:text-foreground"
                  aria-label="Cart"
                >
                  <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.6} />
                  {mounted && cartCount > 0 && (
                    <motion.span
                      className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[10px] font-semibold text-sand"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7 bg-background/97 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navigation.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={item.href}
                  className="cursor-pointer font-serif text-3xl font-medium text-foreground transition-colors hover:text-clay"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 flex items-center gap-6 text-sm text-muted-foreground"
            >
              <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="cursor-pointer hover:text-foreground">
                Account
              </Link>
              <Link href="/account/wishlist" onClick={() => setMobileMenuOpen(false)} className="cursor-pointer hover:text-foreground">
                Wishlist
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header (announcement ~33px + bar 64px) */}
      <div className="h-[97px]" />
    </>
  );
}
