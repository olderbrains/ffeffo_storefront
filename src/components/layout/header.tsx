'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { selectCartCount, useCartStore } from '@/lib/stores/cart-store';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Categories', href: '/categories' },
  { name: 'Brands', href: '/brands' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCartStore(selectCartCount);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled ? 'py-2' : 'py-3',
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <div className="container">
          <div
            className={cn(
              'flex items-center justify-between rounded-2xl px-6 py-3 transition-all duration-500',
              scrolled
                ? 'glass shadow-md shadow-black/[0.03]'
                : 'bg-transparent border border-transparent',
            )}
          >
            <div className="flex items-center gap-8">
              <button
                className="lg:hidden cursor-pointer text-foreground/60 hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative h-8 w-8">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet to-cyan opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-[2px] rounded-[6px] bg-white flex items-center justify-center">
                    <span className="text-sm font-bold text-gradient">S</span>
                  </div>
                </div>
                <span className="text-lg font-bold tracking-tight text-foreground">Speffo</span>
              </Link>

              <nav className="hidden lg:flex lg:gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="cursor-pointer px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg transition-all duration-200 hover:text-foreground hover:bg-black/[0.03]"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-1">
              <Link
                href="/search"
                className="cursor-pointer flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-black/[0.03]"
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px]" />
              </Link>

              <Link
                href="/account/wishlist"
                className="cursor-pointer hidden sm:flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-black/[0.03]"
                aria-label="Wishlist"
              >
                <Heart className="h-[18px] w-[18px]" />
              </Link>

              <Link
                href="/cart"
                className="cursor-pointer relative flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-black/[0.03]"
                aria-label="Cart"
              >
                <ShoppingCart className="h-[18px] w-[18px]" />
                {mounted && cartCount > 0 && (
                  <motion.span
                    className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-violet to-cyan px-1 text-[10px] font-bold text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              <Link
                href="/account"
                className="cursor-pointer flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-black/[0.03]"
                aria-label="Account"
              >
                <User className="h-[18px] w-[18px]" />
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6 lg:hidden"
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
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={item.href}
                  className="text-2xl font-semibold cursor-pointer text-foreground transition-colors hover:text-violet"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  );
}
