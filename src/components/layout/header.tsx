'use client';

import { Heart, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Categories', href: '/categories' },
  { name: 'Brands', href: '/brands' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight">Speffo</span>
          </Link>

          <nav className="hidden lg:flex lg:gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/search"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>

          <Link
            href="/account/wishlist"
            className="hidden text-muted-foreground transition-colors hover:text-foreground sm:block"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </Link>

          <Link
            href="/cart"
            className="relative text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>

          <Link
            href="/account"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div
        className={cn(
          'border-t lg:hidden',
          mobileMenuOpen ? 'block' : 'hidden',
        )}
      >
        <nav className="container py-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
